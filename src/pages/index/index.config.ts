export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '临床TDM训练工具',
      navigationBarBackgroundColor: '#2563eb',
      navigationBarTextStyle: 'white',
    })
  : {
      navigationBarTitleText: '临床TDM训练工具',
      navigationBarBackgroundColor: '#2563eb',
      navigationBarTextStyle: 'white',
    };
