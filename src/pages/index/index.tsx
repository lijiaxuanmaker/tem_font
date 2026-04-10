import { View, Text } from '@tarojs/components';
import { useState } from 'react';
import Taro, { useLoad } from '@tarojs/taro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Stethoscope, Sparkles, HeartPulse } from 'lucide-react-taro';
import { Network } from '@/network';
import './index.css';

const IndexPage = () => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useLoad(() => {
    const userInfo = Taro.getStorageSync('userInfo');
    if (userInfo && userInfo.userId) {
      Taro.redirectTo({ url: '/pages/question/index' });
    }
  });

  const handleLogin = async () => {
    if (!studentId.trim()) {
      setError('请输入学号');
      return;
    }
    if (!name.trim()) {
      setError('请输入姓名');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await Network.request({
        url: '/api/auth/login',
        method: 'POST',
        data: {
          studentId: studentId.trim(),
          name: name.trim(),
        },
      });

      if (res.data.success) {
        Taro.setStorageSync('userInfo', {
          userId: res.data.userId,
          name: res.data.name,
          studentId: res.data.studentId,
        });
        Taro.redirectTo({ url: '/pages/question/index' });
      } else {
        setError(res.data.message || '登录失败，请重试');
      }
    } catch (err) {
      console.error('登录失败:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="min-h-screen relative overflow-hidden">
      {/* 渐变背景 */}
      <View 
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
      />
      
      {/* 装饰圆形 */}
      <View 
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full animate-float"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
      />
      <View 
        className="absolute top-1/3 -left-10 w-40 h-40 rounded-full animate-float delay-300"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      />
      <View 
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full animate-float delay-500"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
      />

      {/* 主内容区 */}
      <View className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        
        {/* Logo 区域 */}
        <View className="animate-fade-in-up mb-8">
          <View 
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 mx-auto animate-breathe"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            <Stethoscope size={48} color="#ffffff" />
          </View>
        </View>

        {/* 标题 */}
        <View className="text-center mb-10 animate-fade-in-up delay-100" style={{ opacity: 0 }}>
          <Text className="text-3xl font-bold text-white mb-3 block">临床TDM训练工具</Text>
          <View className="flex items-center justify-center gap-2">
            <Sparkles size={16} color="#ffffff" style={{ opacity: 0.8 }} />
            <Text className="text-white text-sm" style={{ opacity: 0.8 }}>治疗药物监测案例分析训练平台</Text>
          </View>
        </View>

        {/* 登录卡片 */}
        <View 
          className="w-full max-w-sm rounded-3xl p-6 animate-fade-in-up delay-200"
          style={{ 
            opacity: 0,
            backgroundColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}
        >
          {/* 卡片标题 */}
          <View className="text-center mb-6">
            <View className="flex items-center justify-center gap-2 mb-2">
              <HeartPulse size={20} color="#6366f1" />
              <Text className="text-xl font-semibold text-gray-800">欢迎登录</Text>
            </View>
            <Text className="text-sm text-gray-500">请输入您的信息开始训练</Text>
          </View>

          {/* 输入区域 */}
          <View className="space-y-5">
            {/* 学号输入 */}
            <View>
              <Label className="text-gray-600 text-sm mb-2 block">学号</Label>
              <View 
                className="rounded-xl overflow-hidden"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
              >
                <Input
                  placeholder="请输入您的学号"
                  value={studentId}
                  onInput={(e) => setStudentId(e.detail.value)}
                  className="bg-gray-50 border-0 h-12 px-4"
                />
              </View>
            </View>

            {/* 姓名输入 */}
            <View>
              <Label className="text-gray-600 text-sm mb-2 block">姓名</Label>
              <View 
                className="rounded-xl overflow-hidden"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
              >
                <Input
                  placeholder="请输入您的姓名"
                  value={name}
                  onInput={(e) => setName(e.detail.value)}
                  className="bg-gray-50 border-0 h-12 px-4"
                />
              </View>
            </View>

            {/* 错误提示 */}
            {error && (
              <View 
                className="bg-red-50 border border-red-100 rounded-xl p-3 animate-scale-in"
              >
                <Text className="text-sm text-red-500">{error}</Text>
              </View>
            )}

            {/* 登录按钮 */}
            <View 
              className="rounded-xl overflow-hidden mt-6"
              style={{ 
                background: loading 
                  ? '#94a3b8' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: loading 
                  ? 'none' 
                  : '0 10px 30px rgba(102, 126, 234, 0.4)'
              }}
            >
              <Button
                className="w-full border-0 bg-transparent h-12"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <Text className="text-white font-medium">登录中...</Text>
                ) : (
                  <View className="flex items-center gap-2">
                    <LogIn size={20} color="#ffffff" />
                    <Text className="text-white font-medium">开始训练</Text>
                  </View>
                )}
              </Button>
            </View>
          </View>
        </View>

        {/* 底部说明 */}
        <View className="mt-8 text-center animate-fade-in-up delay-400" style={{ opacity: 0 }}>
          <Text className="text-white text-xs block" style={{ opacity: 0.6 }}>
            本工具仅供医学教育训练使用
          </Text>
          <Text className="text-white text-xs mt-1 block" style={{ opacity: 0.4 }}>
            请在指导下完成案例练习
          </Text>
        </View>
      </View>
    </View>
  );
};

export default IndexPage;
