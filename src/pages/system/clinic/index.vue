<template lang="pug">
  .pagecontent
    .topnavinfo
      .left
      .right
        el-button(type="success", size='mini',@click="save") 保存
        el-button(size='mini') 取消
    
    el-row.conbody
      el-col.left(:span="6")
        .peopleinfo
          .headimg
            img(:src='imgUrl?imgUrl:initImgUrl')
          .file
            span 上传诊所图片
            input.inputfile(type="file", accept="image/png, image/jpeg, image/gif, image/jpg", @change='uploadImg($event)') 
          .name 建议尺寸1000*480

      el-col.right(:span="18")
        .title 诊所所有者信息（即诊所最高负责人）
        el-form.mt(label-width="70px", label-position="right")
          el-row
            el-col(:span='12')
              el-form-item(label="姓名", )
                el-col(:span='15')
                  el-input(size='medium', placeholder='请输入姓名', v-model="info.manager", disabled)
            el-col(:span='11')
              el-form-item(label="电话")
                el-col(:span='12')
                  el-input(size='medium', placeholder='请输入电话', v-model="info.mobile", disabled, type="number")

        .title.mt 诊所信息
        el-form.mt(label-width="70px", label-position="right")
          el-row
            el-col(:span='12')
              el-form-item(label="诊所名称")
                el-col(:span='15')
                  el-input(size='medium', placeholder='请输入诊所名称', v-model="info.orgName")
            el-col(:span='11')
              el-form-item(label="诊所电话")
                el-col(:span='12')
                  el-input(size='medium', placeholder='请输入电话', v-model="info.telephone", type="number")


          el-row.mt
            el-col(:span='24')
              el-form-item(label="诊所地址")
                el-col(:span='18')
                  el-input(size='medium', v-model="info.address", placeholder='选择地址', @keyup.native='autoSearch(info.address)', id='emc-addr')
                    el-button(slot="append", icon="el-icon-search", @click="localtionSearch(info.address)")
                  .map.mt(id='container')
            el-col(:span='24')
              el-form-item(label="优势科室")
                el-col(:span='18')
                  el-select.zhensuoSelect(
                    v-model="value10",
                    multiple,
                    filterable,
                    allow-create,
                    default-first-option,
                    placeholder="选择优势科室")
                    el-option(
                      v-for="item in alldeptList",
                      :key="item.id",
                      :label="item.dept",
                      :value="item.id")
            el-col(:span='24')
              el-form-item(label="诊所简介")
                el-col(:span='18')
                  el-input(type="textarea", placeholder='请输入诊所简介',v-model="info.introduction")

</template>

<script>
import rightAside from '@/components/rightAside'
const clinicImg = require('@/assets/img/clinicimg.png')
export default {
  components: {
    rightAside
  },
  data () {
    return {
      info: {},
      value10: [],
      alldeptList: [],
      inputHide: true,
      initImgUrl: clinicImg,
      imgUrl: ''
    }
  },
  methods: {
    loadJs: (sid, jsurl, callback) => {
      var nodeHead = document.getElementsByTagName('head')[0]
      var nodeScript = null
      if (document.getElementById(sid) === null) {
        nodeScript = document.createElement('script')
        nodeScript.setAttribute('type', 'text/javascript')
        nodeScript.setAttribute('src', jsurl)
        nodeScript.setAttribute('id', sid)
        if (callback != null) {
          nodeScript.onload = nodeScript.onreadystatechange = () => {
            if (nodeScript.ready) {
              return false
            }
            if (!nodeScript.readyState || nodeScript.readyState === 'loaded' || nodeScript.readyState === 'complete') {
              nodeScript.ready = true
              callback()
            }
          }
        }
        nodeHead.appendChild(nodeScript)
      } else {
        if (callback !== null) {
          callback()
        }
      }
    },
    getNoMap () {
      console.log('npmap')
      let _this = this
      let addre = []

      let map = new AMap.Map('container', {
        zoom: 16,
        scrollWheel: false
      })

      AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
        AMap.plugin('AMap.Geolocation', function () {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
            convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: false,        // 显示定位按钮，默认：true
            buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
            showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true     // 定位成功后将定位到的位置作为地图中心点，默认：true
          })
          map.addControl(geolocation)
          geolocation.getCurrentPosition((status, result) => {
            if (status == 'complete') {
              console.log('定位成功')
              _this.ttt = false
              _this.info.lng = result.position.lng
              _this.info.lat = result.position.lat
              addre = [result.position.lng, result.position.lat]
              map.setCenter(addre)
            }
            if (status == 'error') {
              console.log('定位失败')
              _this.ttt = false
              _this.info.lng = '116.397428'
              _this.info.lat = '39.90923'
              addre = ['116.397428', '39.90923']
              map.setCenter(addre)
            }
          })
        })

        let positionPicker = new PositionPicker({
          mode: 'dragMap',
          map: map
        })

        positionPicker.on('success', (positionResult) => {
          this.info.lng = positionResult.position.lng
          this.info.lat = positionResult.position.lat
          this.info.address = positionResult.address
        })

        positionPicker.on('fail', (positionResult) => {
          console.log('选址失败')
        })

        positionPicker.start()
        map.panBy(0, 1)
        map.addControl(new AMap.ToolBar({
          liteStyle: true
        }))
      })
    },
    getMap (localtion) {
      console.log('map')
      // 加载地图组件
      // this.loadJs('mapJs', '//webapi.amap.com/maps?v=1.4.3&key=e0486cec6828c414a027241b76f07c68&plugin=AMap.ToolBar', () => {
      //   this.loadJs('mapUiJs', '//webapi.amap.com/ui/1.0/main.js?v=1.0.11', () => {
      //     this.$nextTick(() => {
      AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
        let map = new AMap.Map('container', {
          zoom: 16,
          center: localtion,
          scrollWheel: false
        })

        let positionPicker = new PositionPicker({
          mode: 'dragMap',
          map: map
        })

        positionPicker.on('success', (positionResult) => {
          this.info.lng = positionResult.position.lng
          this.info.lat = positionResult.position.lat
          this.info.address = positionResult.address
        })
        positionPicker.on('fail', (positionResult) => {
          console.log('选址失败')
        })

        positionPicker.start()
        map.panBy(0, 1)
        map.addControl(new AMap.ToolBar({
          liteStyle: true
        }))
      })
      //     })
      //   })
      // })
    },
    getOrgDetail () {
      let _this = this
      _this.$api.getOrgDetail({
        orgCode: null
      })
      .then(res => {
        if (res.success) {
          console.log(res)
          _this.info = res.result
          _this.imgUrl = _this.info.imgUrl
          _this.alldeptList = _this.info.deptList
          _this.alldeptList.map(function (item) {
            if (item.superiorityFlag == 1) {
              _this.value10.push(item.id)
            }
          })
          let localtion = []
          if (_this.info.lng && _this.info.lat) {
            localtion = [_this.info.lng, _this.info.lat]
            _this.getMap(localtion)
          } else {
            this.getNoMap()
          }
        } else {
          this.$message.error(res.msg)
        }
      }).catch(error => console.log(error))
    },
    uploadImg (event) {
      let codeType = ''
      if (event.target.files[0]) {
        this.$api.dicItemDicTypeCode({
          dicTypeCode: 'QnUpType'
        }).then(res => {
          if (res.success) {
            res.result.map(item => {
              if (item.dicItemCode == '3') {
                codeType = item.dicItemCode
              }
            })
            this.$api.getqnToken({
              type: codeType
            }).then(res => {
              if (res.success) {
                console.dir(event.target)
                let formData = new FormData()
                formData.append('file', event.target.files[0])
                formData.append('token', res.result.upToken)
                formData.append('key', res.result.key)
                this.$api.upQnObj(formData)
                  .then(res => {
                    if (res.key) {
                      this.imgUrl = this.$qiniu + res.key
                      console.log(this.imgUrl)
                    } else {
                      this.$message.error(res.msg)
                    }
                  }).catch(error => console.log(error))
              } else {
                this.$message.error(res.msg)
              }
            }).catch(error => console.log(error))
          } else {
            this.$message.error(res.msg)
          }
        }).catch(error => console.log(error))
      }
    },
    save () {
      let _this = this
      // console.log(_this.value10)
      // console.log(_this.info)
      if (_this.imgUrl) {
        _this.info.imgUrl = _this.imgUrl
      }
      _this.$api.orgSave(_this.info)
        .then(res => {
          if (res.success) {
            _this.$message.success('保存成功!')
          } else {
            this.$message.error(res.msg)
          }
        }).catch(error => console.log(error))
    },
    autoSearch (key) {
      let _this = this
      AMap.plugin(['AMap.Autocomplete'], function () {
        let autoOptions = {
          city: '', // 城市，默认全国
          input: 'emc-addr'// 使用联想输入的input的id
        }
        let autocomplete = new AMap.Autocomplete(autoOptions)
        AMap.event.addListener(autocomplete, 'select', function (e) {
          console.log(e)
          let localtion = [e.poi.location.lng, e.poi.location.lat]
          _this.info.address = e.poi.name
          _this.getMap(localtion)
        })
      })
    },
    localtionSearch (address) {
      let _this = this
      AMap.service('AMap.Geocoder', function () {
        let geocoder = new AMap.Geocoder({
          city: ''
        })
        geocoder.getLocation(address, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            console.log(result)
            let localtion = [result.geocodes[0].location.lng, result.geocodes[0].location.lat]
            _this.getMap(localtion)
          }
        })
      })
    }
  },
  created () {
    this.getOrgDetail()
  }
}
</script>

<style lang='stylus' scoped>
@import './../../../assets/css/var.styl'
.map
  width 100%
  height 500px
  border-radius 4px
  background $dWhite
.peopleinfo
  display flex 
  flex-flow column nowrap
  justify-content center
  align-items center
  .headimg
    width 145px
    height 145px
    background $Silver
    line-height 0
    border-radius 4px
    overflow hidden
    img
      width 100%
      height 100%
  .name
    font-size 12px
    line-height 1.5
    padding 15px 0
    text-align center
    color $elBlack
  .btns
    margin-top 20px
.topnavinfo
  display flex
  flex-flow row no-warp
  justify-content space-between
  align-items center
  padding 0 0 15px 0
  .left
    font-size 14px
    color $lBlack
    span
      color $Black
.zhensuoSelect
  width 100%
.asideTab
  width 100%
  height 100vh
  .top
    height 50px
    display flex
    flex-flow row nowarp
    justify-content center
    align-items center
    .title
      flex 1
      text-align center
      background $elSilver
      height 50px
      line-height 50px
      color $elBlack
      font-size 14px
      &.active
        background $Blue
        color $White
  .asideCon
    height calc(100vh - 100px)
    padding 5px 0
    .search
      padding 20px 50px
    .asidetable
      padding 0 10px
  .asidepagination
    text-align center
    padding 10px 0
  .asideBtns
    height 50px
    text-align center
.mt
  margin-top 20px
  position relative
.el-tag
  cursor pointer
  margin-right 15px
.el-tab-pane
  padding 15px 0
.btninput
  width 100px
  margin-right 15px
.abbutton
  position absolute
  right 10px
  top 6px
  z-index 9
.conbody
  .left
    background $dWhite
    border-right 1px solid $elSilver
    padding 15px
    min-height 950px
  .right
    background $White
    padding 15px
    min-height 950px
    .title
      color $elBlack
      font-size 12px
      line-height 1.5
.el-form-item
  margin-bottom 10px
.inputfile
  position absolute
  cursor pointer
  overflow hidden
  right 0
  top 0
  opacity 0
.file
  margin-top 20px
  padding 3px 15px
  line-height 20px
  position relative
  border 1px solid #dcdfe6
  border-radius 4px
  color #606266
  cursor pointer
  &:hover
    border 1px solid #dcdfe6
    background #dcdfe6
</style>
