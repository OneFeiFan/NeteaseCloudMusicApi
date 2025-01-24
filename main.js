// main.js
const path = require('path')
const { cookieToJson } = require('./util')
const request = require('./util/request')

/** @type {Record<string, any>} */
let obj = {}

// 使用uni-app的requireContext来模拟文件系统遍历
function loadModules(moduleDir) {
  let files = []
  // 这里需要使用uni-app的方式获取文件列表，uni-app中可以使用require.context
  // 但是uni-app的require.context需要通过webpack配置，这里假设已经配置好
  const requireContext = require.context('./module', true, /\.js$/)

  requireContext.keys().forEach((file) => {
    files.push(file.split('/').pop())
  })

  files.reverse().forEach((file) => {
    if (!file.endsWith('.js')) return
    let fileModule = require(`./module/${file}`)
    let fn = file.split('.').shift() || ''

    obj[fn] = function (data = {}) {
      if (typeof data.cookie === 'string') {
        data.cookie = cookieToJson(data.cookie)
      }

      return fileModule(
        {
          ...data,
          cookie: data.cookie ? data.cookie : {},
        },
        request,
      )
    }
  })
}

loadModules()
export default obj
