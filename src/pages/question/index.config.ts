export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '',
      navigationBarBackgroundColor: '#f9fafb',
      navigationBarTextStyle: 'black',
    })
  : {
      navigationBarTitleText: '',
      navigationBarBackgroundColor: '#f9fafb',
      navigationBarTextStyle: 'black',
    };
