module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 37.5, // 根元素字体大小，rem相对px转换的基准值，通常为16px
      propList: ["*"], // 需要转换的属性，* 表示对所有属性都进行转换，支持数组、正则等方式
      unitPrecision: 5, // 允许REM单位增长到的最接近的小数点精度
      selectorBlackList: [], // 排除不进行转换的类名
      replace: true, // 是否直接替换（默认为true）
      mediaQuery: false, // 是否转换媒体查询中的px（默认为false）
      exclude: (path) => {
        // 不进行转换的文件路径（根据返回值判断，返回值为false则此文件不进行转换）
        // return !path.includes('/views/system-dashboard')
      },
    },
  },
};
