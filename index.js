;(async () => {
  /**
   * 远程获取省市区数据，当获取完成后，得到一个数组
   * @returns Promise
   */
  async function getDatas() {
    return fetch('https://study.duyiedu.com/api/citylist')
      .then(resp => resp.json())
      .then(resp => resp.data)
  }
  const data = await getDatas()
  // 获取需要操作的dom元素
  const doms = {
    cascadeItems: document.querySelectorAll('.cascade-item'),
    cascadeProvince: document.querySelector('.cascade-province'),
    cascadeCity: document.querySelector('.cascade-city'),
    cascadeDistrict: document.querySelector('.cascade-district'),
    cascadeSelecteds: document.querySelectorAll('.cascade-selected'),
    cascadeProvinceSelected: document.querySelector('.cascade-province-selected'),
    cascadeCitySelected: document.querySelector('.cascade-city-selected'),
    cascadeDistrictSelected: document.querySelector('.cascade-district-selected'),
    cascadeProvinceSubmenu: document.querySelector('.cascade-province-submenu'),
    cascadeCitySubmenu: document.querySelector('.cascade-city-submenu'),
    cascadeDistrictSubmenu: document.querySelector('.cascade-district-submenu')
  }
  // 定义初始化函数
  function init() {
    // 初始化级联
    initCascade()
  }
  // 定义初始化级联状态函数
  function initCascade() {
    doms.cascadeProvince.setAttribute('data-status', 'normal')
    doms.cascadeCity.setAttribute('data-status', 'disabled')
    doms.cascadeDistrict.setAttribute('data-status', 'disabled')
    doms.cascadeSelecteds.forEach(seleted => seleted.classList.remove('active'))
    doms.cascadeProvinceSelected.innerHTML = '请选择省份'
    doms.cascadeCitySelected.innerHTML = '请选择城市'
    doms.cascadeDistrictSelected.innerHTML = '请选择地区'
    // 向级联二级菜单注入内容
    injectIntoSubmenu(doms.cascadeProvinceSubmenu, data)
    injectIntoSubmenu(doms.cascadeCitySubmenu, [])
    injectIntoSubmenu(doms.cascadeDistrictSubmenu, [])
  }
  /**
   * 定义向指定二级菜单注入内容函数
   * @param {HTMLElement} submenu
   * @param {Array} items
   */
  function injectIntoSubmenu(submenu, items) {
    submenu.innerHTML = ''
    const html = items.map(item => `<div class="cascade-submenu-item" data-value="${item.value}">${item.label}</div>`).join('')
    submenu.innerHTML = html
  }
  // 定义注册用户交互事件函数
  function regEvents() {
    // 级联点击事件
    doms.cascadeItems.forEach(item =>
      item.addEventListener('click', function (e) {
        if (
          this.dataset.status === 'disabled' ||
          (e.target.className.includes('cascade-submenu') && !e.target.className.includes('cascade-submenu-item'))
        ) {
          return
        }
        const seleted = this.querySelector('.cascade-selected')
        if (seleted.className.includes('active')) {
          return seleted.classList.remove('active')
        }
        doms.cascadeSelecteds.forEach(seleted => seleted.classList.remove('active'))
        seleted.classList.add('active')
      })
    )
    // 二级菜单内容点击事件
    // 省份二级菜单
    doms.cascadeProvinceSubmenu.addEventListener('click', function (e) {
      if (!e.target.className.includes('cascade-submenu-item')) {
        return
      }
      Array.from(this.children).forEach(item => item.classList.remove('active'))
      e.target.classList.add('active')
      doms.cascadeProvinceSelected.innerHTML = e.target.innerHTML
      // 为城市二级菜单注入内容并激活
      doms.cascadeCitySelected.innerHTML = '请选择城市'
      let province = data.find(province => province.value === e.target.dataset.value)
      const cities = province ? province.children : []
      injectIntoSubmenu(doms.cascadeCitySubmenu, cities)
      doms.cascadeCity.setAttribute('data-status', 'normal')
      // 清空地区二级菜单并禁用
      doms.cascadeDistrictSelected.innerHTML = '请选择地区'
      injectIntoSubmenu(doms.cascadeDistrictSubmenu, [])
      doms.cascadeDistrict.setAttribute('data-status', 'disabled')
    })
    // 城市二级菜单
    doms.cascadeCitySubmenu.addEventListener('click', function (e) {
      if (!e.target.className.includes('cascade-submenu-item')) {
        return
      }
      Array.from(this.children).forEach(item => item.classList.remove('active'))
      e.target.classList.add('active')
      doms.cascadeCitySelected.innerHTML = e.target.innerHTML
      // 为地区二级菜单注入内容并激活
      doms.cascadeDistrictSelected.innerHTML = '请选择地区'
      const province = data.find(province => province.children.some(city => city.value === e.target.dataset.value)) || {}

      const cities = province.children || []
      const city = cities.find(city => city.value === e.target.dataset.value) || {}
      const districts = city.children || []
      injectIntoSubmenu(doms.cascadeDistrictSubmenu, districts)
      doms.cascadeDistrict.setAttribute('data-status', 'normal')
    })
    // 地区二级菜单
    doms.cascadeDistrictSubmenu.addEventListener('click', function (e) {
      if (!e.target.className.includes('cascade-submenu-item')) {
        return
      }
      Array.from(this.children).forEach(item => item.classList.remove('active'))
      e.target.classList.add('active')
      doms.cascadeDistrictSelected.innerHTML = e.target.innerHTML
    })
  }
  // 定义入口主函数
  function main() {
    // 初始化
    init()
    // 用户交互
    regEvents()
  }
  // 入口函数调用
  main()
})()
