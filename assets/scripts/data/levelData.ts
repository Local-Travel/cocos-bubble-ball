/** 
 * 获取关卡数据
 * */
export function getLevelData(level: number) {
  const levelList = [
    {
      id: 1,
      level: 1,
      score: 900,
      bubbleCount: 10,
      maxLen: 10,
      name: '关卡 1',
      desc: '',
      list: [
        1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1,
        1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1,
        1, 2, 2, 2, 1, 1, 2, 2, 1, 1, 1,
        2, 1, 1, 0, 2, 2, 1, 2, 1, 1, 1,
        1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1,
        1, 1, 2, 1, 1, 2, 2, 1, 1, 1, 1,
      ]
    },
    {
      id: 2,
      level: 2,
      score: 1500,
      bubbleCount: 15,
      maxLen: 10,
      name: '关卡 2',
      desc: '',
      list: [
        1, 3, 1, 1, 1, 2, 2, 2, 1, 1, 1,
        1, 3, 3, 3, 2, 2, 3, 0, 1, 0, 1,
        1, 2, 2, 2, 1, 1, 2, 2, 1, 3, 1,
        2, 1, 1, 0, 0, 0, 1, 2, 3, 3, 1,
        1, 1, 3, 3, 2, 0, 1, 1, 2, 1, 1,
        1, 1, 3, 3, 1, 0, 0, 1, 1, 2, 2,
      ]
    },
  ]

  const col = 11
  let data = levelList[0]
  if (level <= levelList.length && level > 0) {
    data = levelList[level - 1]
  }
  return {
    col,
    list: data.list,
    data,
  }
} 