/** 
 * 获取关卡数据
 * */
export function getLevelData(level: number) {
  const levelList = [
    {
      id: 1,
      level: 1,
      name: '第一关',
      desc: '这是第一关',
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
      name: '第二关',
      desc: '这是第二关',
      list: [
        1, 1, 1, 1, 1, 2, 2, 2,
        0, 1, 1, 3, 2, 2, 2, 0,
        0, 1, 1, 3, 3, 3, 2, 0,
        0, 1, 1, 0, 2, 2, 0, 0,
        0, 1, 1, 0, 0, 2, 0, 0,
        0, 1, 1, 0, 0, 2, 0, 0,
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