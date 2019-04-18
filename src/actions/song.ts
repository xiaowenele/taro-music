import {
  GETSONGDETAIL,
  GETPLAYLISTDETAIL,
  GETRECOMMENDPLAYLIST,
  GETRECOMMENDDJ,
  GETRECOMMENDNEWSONG,
  GETRECOMMEND,
  GETSONGINFO,
  CHANGEPLAYMODE
} from '../constants/song'
import api from '../services/api'
import { parse_lrc } from '../utils/common'

export const getSongDetail = (payload) => {
  return {
    type: GETSONGDETAIL,
    payload
  }
}

// 获取歌单详情
export const getPlayListDetail = (payload) => {
  const { id } = payload
  return dispatch => {
    api.get('/playlist/detail', {
      id
    }).then((res) => {
      let playListDetailInfo = res.data.playlist
      playListDetailInfo.tracks = playListDetailInfo.tracks.map((item) => {
        let temp: any = {}
        temp.name = item.name
        temp.id = item.id
        temp.ar = item.ar
        temp.al = item.al
        temp.copyright = item.copyright
        return temp
      })
      dispatch({
        type: GETPLAYLISTDETAIL,
        payload: {
          playListDetailInfo,
          playListDetailPrivileges: res.data.privileges
        }
      })
    })
  }
}

// 获取推荐歌单
export const getRecommendPlayList = () => {
  return dispatch => {
    api.get('/personalized').then((res) => {
      let recommendPlayList = res.data.result
      dispatch({
        type: GETRECOMMENDPLAYLIST,
        payload: {
          recommendPlayList
        }
      })
    })
  }
}

// 获取推荐电台
export const getRecommendDj = () => {
  return dispatch => {
    api.get('/personalized/djprogram').then((res) => {
      let recommendDj = res.data.result
      dispatch({
        type: GETRECOMMENDDJ,
        payload: {
          recommendDj
        }
      })
    })
  }
}

// 获取推荐新音乐
export const getRecommendNewSong = () => {
  return dispatch => {
    api.get('/personalized/newsong').then((res) => {
      let recommendNewSong = res.data.result
      dispatch({
        type: GETRECOMMENDNEWSONG,
        payload: {
          recommendNewSong
        }
      })
    })
  }
}

// 获取推荐精彩节目
export const getRecommend = () => {
  return dispatch => {
    api.get('/personalized/recommend').then((res) => {
      let recommend = res.data.result
      dispatch({
        type: GETRECOMMEND,
        payload: {
          recommend
        }
      })
    })
  }
}

// 获取歌曲详情信息
export const getSongInfo = (payload) => {
  const { id } = payload
  return dispatch => {
    api.get('/song/detail', {
      ids: id
    }).then((res) => {
      let songInfo = res.data.songs[0]
      api.get('/song/url', {
        id
      }).then((res) => {
        songInfo.url = res.data.data[0].url
        api.get('/lyric', {
          id
        }).then((res) => {
          const lrc = parse_lrc(res.data.lrc && res.data.lrc.lyric ? res.data.lrc.lyric : '');
          res.data.lrclist = lrc.now_lrc;
          res.data.scroll = lrc.scroll ? 1 : 0
          songInfo.lrcInfo = res.data
          dispatch({
            type: GETSONGINFO,
            payload: {
              currentSongInfo: songInfo
            }
          })
        })
      })
    })
  }
}

// 切换播放模式
export const changePlayMode = (payload) => {
  return {
    type: CHANGEPLAYMODE,
    payload
  }
}



