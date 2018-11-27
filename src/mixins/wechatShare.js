/**
 * wxConfig
 * @param [title, des, imgUrl, link] opts
 */

import { wxShare } from '@utils/wechat'

export const wxShareMixin = {
  mounted() {
    let wxConfig = this.$options.wxConfig
    this.$_wxShareMixin_wx(wxConfig)
  },
  methods: {
    $_wxShareMixin_wx(wxConfig) {
      wxShare.init(() => {
        wxShare.initWechat(() => {
          wxShare.initShare(
            ...wxConfig
          )
        })
      })
    }
  }
}
