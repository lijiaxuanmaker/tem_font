import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import { useState, useEffect, useRef } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { Button } from '@/components/ui/button';
import { 
  FileQuestionMark, 
  Mic, 
  MicOff, 
  Send, 
  RefreshCw, 
  Award,
  ChevronDown,
  ChevronUp,
  Activity,
  MessageSquare,
  Target,
  BookOpen,
  CircleCheck,
  BadgeAlert,
  Star,
  Heart,
  ClipboardList,
} from 'lucide-react-taro';
import { Network } from '@/network';

interface DetailedFeedback {
  serviceProcess?: string;
  professionalAbility?: string;
  communication?: string;
}

interface Result {
  score: number;
  serviceScore: number;
  professionalScore: number;
  communicationScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: DetailedFeedback;
  correctAnswer: string;
  scoringCriteria: string;
}

const QuestionPage = () => {
  const [userInfo, setUserInfo] = useState<{ userId: number; name: string; studentId: string } | null>(null);
  const [question, setQuestion] = useState<{ questionId: number; title: string; content: string } | null>(null);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recorderManagerRef = useRef<Taro.RecorderManager | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedAnswer, setExpandedAnswer] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP;

  useDidShow(() => {
    const storedUserInfo = Taro.getStorageSync('userInfo');
    if (!storedUserInfo || !storedUserInfo.userId) {
      Taro.redirectTo({ url: '/pages/index/index' });
      return;
    }
    setUserInfo(storedUserInfo);
  });

  useEffect(() => {
    if (isWeapp && !recorderManagerRef.current) {
      recorderManagerRef.current = Taro.getRecorderManager();
      recorderManagerRef.current.onStop((res) => {
        setIsRecording(false);
        handleVoiceRecognition(res.tempFilePath);
      });
      recorderManagerRef.current.onError(() => {
        setIsRecording(false);
        Taro.showToast({ title: '录音失败', icon: 'none' });
      });
    }
  }, [isWeapp]);

  const fetchQuestion = async () => {
    if (!userInfo) return;
    setLoading(true);
    setResult(null);
    setAnswer('');
    setShowResult(false);

    try {
      const res = await Network.request({
        url: '/api/question/random',
        method: 'POST',
        data: { userId: userInfo.userId },
      });

      if (res.data.success) {
        setQuestion({
          questionId: res.data.questionId,
          title: res.data.title,
          content: res.data.content,
        });
      } else {
        Taro.showToast({ title: res.data.message || '获取题目失败', icon: 'none' });
      }
    } catch {
      Taro.showToast({ title: '网络错误', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceRecognition = async (filePath: string) => {
    Taro.showLoading({ title: '识别中...' });
    try {
      const uploadRes = await Network.uploadFile({
        url: '/api/asr/recognize',
        filePath: filePath,
        name: 'file',
      });
      const data = JSON.parse(uploadRes.data);
      if (data.success && data.text) {
        setAnswer(prev => prev + (prev ? '\n' : '') + data.text);
      }
    } catch {
      Taro.showToast({ title: '语音识别失败', icon: 'none' });
    } finally {
      Taro.hideLoading();
    }
  };

  const toggleRecording = async () => {
    if (!isWeapp) {
      Taro.showToast({ title: '语音功能仅在小程序中可用', icon: 'none' });
      return;
    }

    if (isRecording) {
      recorderManagerRef.current?.stop();
    } else {
      try {
        await Taro.authorize({ scope: 'scope.record' });
      } catch {
        Taro.showModal({
          title: '需要录音权限',
          content: '请在设置中开启录音权限',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) Taro.openSetting();
          },
        });
        return;
      }
      recorderManagerRef.current?.start({ duration: 60000, sampleRate: 16000, format: 'mp3' });
      setIsRecording(true);
    }
  };

  const submitAnswer = async () => {
    if (!userInfo || !question) return;
    if (!answer.trim()) {
      Taro.showToast({ title: '请输入答案', icon: 'none' });
      return;
    }

    setSubmitting(true);

    try {
      const res = await Network.request({
        url: '/api/question/submit',
        method: 'POST',
        data: {
          userId: userInfo.userId,
          questionId: question.questionId,
          answer: answer.trim(),
        },
      });

      if (res.data.success) {
        setResult({
          score: res.data.score,
          serviceScore: res.data.serviceScore,
          professionalScore: res.data.professionalScore,
          communicationScore: res.data.communicationScore,
          strengths: res.data.strengths || [],
          improvements: res.data.improvements || [],
          detailedFeedback: res.data.detailedFeedback || {},
          correctAnswer: res.data.correctAnswer,
          scoringCriteria: res.data.scoringCriteria,
        });
        setTimeout(() => setShowResult(true), 100);
      } else {
        Taro.showToast({ title: res.data.message || '判分失败', icon: 'none' });
      }
    } catch {
      Taro.showToast({ title: '网络错误', icon: 'none' });
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreConfig = (score: number) => {
    if (score >= 80) return { 
      label: '优秀', 
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      subLabel: '表现出色，继续保持！'
    };
    if (score >= 60) return { 
      label: '良好', 
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      subLabel: '还有提升空间，继续加油！'
    };
    return { 
      label: '需加强', 
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      subLabel: '建议多加练习，查漏补缺。'
    };
  };

  return (
    <View className="min-h-screen bg-gray-50">
      <ScrollView className="p-4" style={{ height: '100vh' }} scrollY>
        {/* 初始状态 */}
        {!question && !result && (
          <View className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
            <View 
              className="w-28 h-28 rounded-3xl flex items-center justify-center mb-6 animate-float"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
              }}
            >
              <FileQuestionMark size={48} color="#ffffff" />
            </View>
            <Text className="text-xl font-semibold text-gray-800 mb-2">准备好开始训练了吗？</Text>
            <Text className="text-gray-500 text-sm mb-8">点击下方按钮获取病例案例</Text>
            <View 
              className="rounded-xl overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
              }}
            >
              <Button
                size="lg"
                onClick={fetchQuestion}
                disabled={loading}
                className="border-0 bg-transparent px-12"
              >
                {loading ? (
                  <Text className="text-white">加载中...</Text>
                ) : (
                  <View className="flex items-center gap-2">
                    <RefreshCw size={18} color="#ffffff" />
                    <Text className="text-white font-medium">开始做题</Text>
                  </View>
                )}
              </Button>
            </View>
          </View>
        )}

        {/* 题目展示 */}
        {question && !result && (
          <View className="space-y-4 animate-fade-in-up">
            {/* 题目卡片 */}
            <View 
              className="rounded-2xl p-5 bg-white"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              <View className="flex items-center gap-2 mb-4">
                <View 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  <FileQuestionMark size={18} color="#ffffff" />
                </View>
                <Text className="text-lg font-semibold text-gray-800">{question.title}</Text>
              </View>
              <ScrollView style={{ maxHeight: '280px' }} scrollY className="pr-2">
                <Text className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{question.content}</Text>
              </ScrollView>
            </View>

            {/* 答案输入区 */}
            <View 
              className="rounded-2xl p-5 bg-white"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              <View className="flex items-center gap-2 mb-4">
                <View 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
                >
                  <Activity size={18} color="#ffffff" />
                </View>
                <Text className="text-base font-semibold text-gray-800">答案输入</Text>
              </View>
              
              <View 
                className="rounded-xl p-4 mb-4"
                style={{ backgroundColor: '#f8fafc' }}
              >
                <Textarea
                  style={{ width: '100%', minHeight: '140px', backgroundColor: 'transparent' }}
                  placeholder="请输入您的分析和回答..."
                  value={answer}
                  onInput={(e) => setAnswer(e.detail.value)}
                  className="text-sm text-gray-700"
                  maxlength={2000}
                />
              </View>

              <View className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleRecording}
                  style={{
                    backgroundColor: isRecording ? '#fef2f2' : '#f8fafc',
                    borderColor: isRecording ? '#ef4444' : '#e5e7eb'
                  }}
                >
                  {isRecording ? (
                    <View className="flex items-center gap-2">
                      <MicOff size={16} color="#ef4444" />
                      <Text className="text-red-500">停止录音</Text>
                    </View>
                  ) : (
                    <View className="flex items-center gap-2">
                      <Mic size={16} color="#6366f1" />
                      <Text className="text-indigo-600">语音输入</Text>
                    </View>
                  )}
                </Button>
                {!isWeapp && (
                  <Text className="text-xs text-gray-400">（小程序可用）</Text>
                )}
              </View>
            </View>

            {/* 提交按钮 */}
            <View 
              className="rounded-xl overflow-hidden"
              style={{ 
                background: answer.trim() 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#cbd5e1',
                boxShadow: answer.trim() 
                  ? '0 10px 30px rgba(102, 126, 234, 0.4)'
                  : 'none'
              }}
            >
              <Button
                size="lg"
                onClick={submitAnswer}
                disabled={submitting || !answer.trim()}
                className="w-full border-0 bg-transparent h-12"
              >
                {submitting ? (
                  <Text className="text-white">判分中...</Text>
                ) : (
                  <View className="flex items-center gap-2">
                    <Send size={18} color="#ffffff" />
                    <Text className="text-white font-medium">提交答案</Text>
                  </View>
                )}
              </Button>
            </View>
          </View>
        )}

        {/* 结果展示 */}
        {result && showResult && (
          <View className="space-y-4 animate-fade-in-up">
            {/* 分数卡片 */}
            <View 
              className="rounded-2xl p-6 text-center relative overflow-hidden"
              style={{ 
                background: getScoreConfig(result.score).gradient,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
              }}
            >
              <View className="absolute top-0 right-0 w-32 h-32 rounded-full" 
                style={{ background: 'rgba(255,255,255,0.1)', transform: 'translate(30%, -30%)' }} 
              />
              <Award size={32} color="rgba(255,255,255,0.8)" className="mb-2" />
              <Text className="text-5xl font-bold text-white mb-1 block">{result.score}</Text>
              <Text className="text-white text-lg mb-1 block" style={{ opacity: 0.8 }}>{getScoreConfig(result.score).label}</Text>
              <Text className="text-white text-sm block" style={{ opacity: 0.6 }}>{getScoreConfig(result.score).subLabel}</Text>
            </View>

            {/* 分项得分 */}
            <View 
              className="rounded-2xl p-5 bg-white"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              <View className="flex items-center gap-2 mb-4">
                <Target size={18} color="#6366f1" />
                <Text className="font-semibold text-gray-800">分项得分</Text>
              </View>
              
              <View className="space-y-4">
                <View>
                  <View className="flex justify-between items-center mb-2">
                    <Text className="text-sm text-gray-600">服务流程</Text>
                    <Text className="text-sm font-semibold text-gray-800">{result.serviceScore}/20分</Text>
                  </View>
                  <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <View 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(result.serviceScore / 20) * 100}%`,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                      }}
                    />
                  </View>
                </View>
                
                <View>
                  <View className="flex justify-between items-center mb-2">
                    <Text className="text-sm text-gray-600">专业能力</Text>
                    <Text className="text-sm font-semibold text-gray-800">{result.professionalScore}/60分</Text>
                  </View>
                  <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <View 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(result.professionalScore / 60) * 100}%`,
                        background: 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)'
                      }}
                    />
                  </View>
                </View>
                
                <View>
                  <View className="flex justify-between items-center mb-2">
                    <Text className="text-sm text-gray-600">沟通和人文</Text>
                    <Text className="text-sm font-semibold text-gray-800">{result.communicationScore}/20分</Text>
                  </View>
                  <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <View 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(result.communicationScore / 20) * 100}%`,
                        background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)'
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* 优点 */}
            {result.strengths && result.strengths.length > 0 && (
              <View 
                className="rounded-2xl bg-white overflow-hidden"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                <View className="flex items-center gap-2 p-5 pb-3">
                  <View className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                    <CircleCheck size={18} color="#16a34a" />
                  </View>
                  <Text className="font-semibold text-gray-800">答题亮点</Text>
                </View>
                <View className="px-5 pb-5">
                  {result.strengths.map((item, index) => (
                    <View key={index} className="flex items-start gap-3 mb-3 last:mb-0">
                      <View className="w-5 h-5 rounded-full flex items-center justify-center mt-1" style={{ backgroundColor: '#dcfce7' }}>
                        <Text className="text-xs font-medium text-green-600">{index + 1}</Text>
                      </View>
                      <Text className="text-sm text-gray-600 flex-1 leading-relaxed">{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 改进建议 */}
            {result.improvements && result.improvements.length > 0 && (
              <View 
                className="rounded-2xl bg-white overflow-hidden"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                <View className="flex items-center gap-2 p-5 pb-3">
                  <View className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                    <BadgeAlert size={18} color="#d97706" />
                  </View>
                  <Text className="font-semibold text-gray-800">改进建议</Text>
                </View>
                <View className="px-5 pb-5">
                  {result.improvements.map((item, index) => (
                    <View key={index} className="flex items-start gap-3 mb-3 last:mb-0">
                      <View className="w-5 h-5 rounded-full flex items-center justify-center mt-1" style={{ backgroundColor: '#fef3c7' }}>
                        <Text className="text-xs font-medium text-amber-600">{index + 1}</Text>
                      </View>
                      <Text className="text-sm text-gray-600 flex-1 leading-relaxed">{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 详细评价 */}
            {result.detailedFeedback && (result.detailedFeedback.serviceProcess || result.detailedFeedback.professionalAbility || result.detailedFeedback.communication) && (
              <View 
                className="rounded-2xl bg-white overflow-hidden"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                <View className="flex items-center gap-2 p-5 pb-3">
                  <View className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ede9fe' }}>
                    <ClipboardList size={18} color="#7c3aed" />
                  </View>
                  <Text className="font-semibold text-gray-800">详细评价</Text>
                </View>
                <View className="px-5 pb-5 space-y-4">
                  {result.detailedFeedback.serviceProcess && (
                    <View className="rounded-xl p-4" style={{ backgroundColor: '#f5f3ff' }}>
                      <View className="flex items-center gap-2 mb-2">
                        <Star size={14} color="#7c3aed" />
                        <Text className="text-sm font-medium text-purple-700">服务流程</Text>
                      </View>
                      <Text className="text-sm text-gray-600 leading-relaxed">{result.detailedFeedback.serviceProcess}</Text>
                    </View>
                  )}
                  {result.detailedFeedback.professionalAbility && (
                    <View className="rounded-xl p-4" style={{ backgroundColor: '#ecfdf5' }}>
                      <View className="flex items-center gap-2 mb-2">
                        <Heart size={14} color="#059669" />
                        <Text className="text-sm font-medium text-emerald-700">专业能力</Text>
                      </View>
                      <Text className="text-sm text-gray-600 leading-relaxed">{result.detailedFeedback.professionalAbility}</Text>
                    </View>
                  )}
                  {result.detailedFeedback.communication && (
                    <View className="rounded-xl p-4" style={{ backgroundColor: '#fdf2f8' }}>
                      <View className="flex items-center gap-2 mb-2">
                        <MessageSquare size={14} color="#db2777" />
                        <Text className="text-sm font-medium text-pink-700">沟通人文</Text>
                      </View>
                      <Text className="text-sm text-gray-600 leading-relaxed">{result.detailedFeedback.communication}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* 参考答案 */}
            <View 
              className="rounded-2xl bg-white overflow-hidden"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              <View 
                className="flex items-center justify-between p-5"
                onClick={() => setExpandedAnswer(!expandedAnswer)}
              >
                <View className="flex items-center gap-2">
                  <BookOpen size={18} color="#11998e" />
                  <Text className="font-semibold text-gray-800">参考答案</Text>
                </View>
                {expandedAnswer ? (
                  <ChevronUp size={20} color="#9ca3af" />
                ) : (
                  <ChevronDown size={20} color="#9ca3af" />
                )}
              </View>
              {expandedAnswer && (
                <View className="px-5 pb-5 pt-0">
                  <View 
                    className="rounded-xl p-4"
                    style={{ backgroundColor: '#f0fdf4' }}
                  >
                    <ScrollView style={{ maxHeight: '300px' }} scrollY>
                      <Text className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{result.correctAnswer}</Text>
                    </ScrollView>
                  </View>
                </View>
              )}
            </View>

            {/* 继续练习按钮 */}
            <View 
              className="rounded-xl overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
              }}
            >
              <Button
                size="lg"
                onClick={() => {
                  setResult(null);
                  setQuestion(null);
                  setAnswer('');
                  setShowResult(false);
                }}
                className="w-full border-0 bg-transparent h-12"
              >
                <View className="flex items-center gap-2">
                  <RefreshCw size={18} color="#ffffff" />
                  <Text className="text-white font-medium">继续练习</Text>
                </View>
              </Button>
            </View>

            <View className="h-8" />
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

export default QuestionPage;
