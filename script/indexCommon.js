//index




var play;
var timer2;
var timer1;
var historyUrlArray;
var y;
var DangQianbofangid;
var rets;
var shunxuplays;
var danquplays;
var suijiplays;
var bofangmoshiid;
var playTime;
var a;
var bofang;
var playlistid;
var luyintitle;
var luyinname;
var luyinplay;
var luyinbody;
var lenth;
var dataArray = new Array();
var caogaoId;
var caogaoTitle;
var caogaoName;
var caogaoBody;

//播放音频信息
function fnBoFangSouSuoyinpinxinxi() {
    var id = historyUrlArray[play];
    api.ajax({
        url: 'http://47.100.11.38/kongmeng/thirdParty/search_songs_by_id.php?id= ' + id,
        method: 'get',
        dataType: 'json',
    }, function(ret, err) {
        if (ret) {
            fnFuZhiAudio(ret.data[0].url);
            //netUrl(ret.data[0].id);
            // fnTitlexianshi(ret.data[0].name);
            // fnGeCixianshi(ret.data[0].desc);
            // fnZongShiChang(ret.data[0].zongSC);
            var singerName = ret.data[0].singerName;
            //AddHistoryTitle(title, singerName);

        } else {
            alert(JSON.stringify(err));
        }
    });
}
//播放歌单音频
function fnBoFangyinpinxinxiing(play) {
    // console.log(play);
    // console.log(JSON.stringify(ret));
    var playgedan = rets.data[play].id;
    api.sendEvent({
        name: 'netPlaying',
        extra: {
            playing: play,
        }
    });
    api.ajax({
        url: 'http://47.100.11.38/kongmeng/thirdParty/search_songs_by_id.php?id= ' + playgedan,
        method: 'get',
        dataType: 'json',
    }, function(ret, err) {
        if (JSON.stringify(ret.data) == '[]') {

            netRecordingModuleing(playgedan);

        } else {
            if (playlistid) {
                api.sendEvent({
                    name: 'netbofangsssssss',
                    extra: {
                        a: playgedan,
                        playlistid: playlistid,
                        bofang: bofang
                    }
                });
            }
            // console.log(ret.data[0].url);

            netAudioPlaying(ret.data[0].url);
            api.sendEvent({
                name: 'jibenxinxi',
                extra: {
                    titlename: ret.data[0].name,
                    desc: ret.data[0].desc,
                    singerName: ret.data[0].singerName
                }
            });

        }
    });
}
//再次播放歌单音频
function fnBoFangyinpinxinxi() {
    // console.log(play);

    var playgedan = rets.data[play].id;
    api.sendEvent({
        name: 'netPlaying',
        extra: {
            playing: play,
        }
    });
    // console.log(playgedan);
    api.ajax({
        url: 'http://47.100.11.38/kongmeng/thirdParty/search_songs_by_id.php?id= ' + playgedan,
        method: 'get',
        dataType: 'json',
    }, function(ret, err) {
        if (JSON.stringify(ret.data) == '[]') {

            netRecordingModule(playgedan);

        } else {
            if (playlistid) {
                api.sendEvent({
                    name: 'netbofangsssssss',
                    extra: {
                        a: playgedan,
                        playlistid: playlistid,
                        bofang: bofang
                    }
                });
            }
            // console.log(ret.data[0].url);

            netAudioPlay(ret.data[0].url);

            api.sendEvent({
                name: 'jibenxinxi',
                extra: {
                    titlename: ret.data[0].name,
                    desc: ret.data[0].desc,
                    singerName: ret.data[0].singerName
                }
            });
        }
    });
}

function netRecordingModule(playgedan) {
    url = 'fs://caogaoxiang/' + playgedan + '';
    // console.log(url);
    netAudioPlay(url);

    api.sendEvent({
        name: 'jibenxinxi',
        extra: {
            titlename: rets.data[play].name,
            desc: rets.data[play].desc,
            singerName: rets.data[play].singerName
        }
    });
}

function netRecordingModuleing(playgedan) {
    url = 'fs://caogaoxiang/' + playgedan + '';
    netAudioPlaying(url);
    api.sendEvent({
        name: 'jibenxinxi',
        extra: {
            titlename: rets.data[play].title,
            desc: rets.data[play].desc,
            singerName: rets.data[play].name
        }
    });

}
//音频播放模块
function netAudioPlay(url) {
    clearInterval(timer1);
    var audioPlayer = api.require('audioPlayer');
    audioPlayer.initPlayer({
        path: url,
        cache: false
    }, function(ret) {
        if (ret.status) {
            lenth = ret.duration;
            api.sendEvent({
                name: 'totalTime',
                extra: {
                    lenth: lenth,
                    cur: ret.current
                }
            });
            addtime(lenth);
            // api.alert({ msg: JSON.stringify(ret) });
        }
    });
    initEventListennerBoFangMoshi();
    // console.log(bofangmoshiid);
    fnBoFangmoshiid();
}

function netAudioPlaying() {
    clearInterval(timer1);
    var audioPlayer = api.require('audioPlayer');
    audioPlayer.play();
    initEventListennerBoFangMoshi();
    // console.log(bofangmoshiid);
    fnBoFangmoshiid();
}
//播放时间
function addtime(lenth) {
    var audioPlayer = api.require('audioPlayer');
    timer1 = setInterval(function() {
        audioPlayer.getCurrent(function(ret) {
            cur = parseInt(ret.current);
            temp = cur;
            minute = parseInt(temp / 60);
            if (cur % 60 < 10) {
                var html = "" + minute + ":0" + cur % 60 + "";
                api.sendEvent({
                    name: 'bofangshijian',
                    extra: {
                        bofangshijian: html,
                        lenth: lenth,
                        cur: ret.current
                    }
                });
                api.sendEvent({
                    name: 'zongJinDu',
                    extra: {
                        cur: cur,
                        lenth: lenth,
                    }
                });
            } else {
                var html = "" + minute + ":" + cur % 60 + "";
                api.sendEvent({
                    name: 'bofangshijian',
                    extra: {
                        bofangshijian: html,
                        lenth: lenth,
                        cur: ret.current
                    }
                });
                api.sendEvent({
                    name: 'zongJinDu',
                    extra: {
                        cur: cur,
                        lenth: lenth,
                    }
                });
            }
        });
    }, 1000);

}

//暂停音频
function netAudioPause() {
    var audioPlayer = api.require('audioPlayer');
    audioPlayer.pause();
}
//关闭音频
function netAudioStop() {
    var audioPlayer = api.require('audioPlayer');
    audioPlayer.stop();
}
//添加搜索历史id
function netUrl(id) {
    api.getPrefs({
        key: 'sousuohistoryurl'
    }, function(ret, err) {
        if (ret) {
            var flag = false; //是否增加历史记录
            var historyUrlText = ret.value;
            var historyUrlArray = historyUrlText.split(',');
            for (var i = 0; i < historyUrlArray.length; i++) {
                historyUrlArray[i] == id && (flag = true);
            }!flag && historyUrlArray.splice(1, 0, id);
            !flag && api.setPrefs({
                key: 'sousuohistoryurl',
                value: historyUrlArray.join(',')
            });
            fnHistoryUrl(id);
        } else {
            alert(JSON.stringify(err));
        }
    });
}
//循环搜索历史id

function fnHistoryUrl(id) {
    var yinpin = $api.byId('yinpin');
    api.getPrefs({
        key: 'sousuohistoryurl'
    }, function(ret, err) {
        var historyUrlText = '' || ret.value;
        historyUrlArray = historyUrlText.split(',');
        for (var i = 0; i < historyUrlArray.length; i++) {
            if (historyUrlArray[i].length == 0)
                continue;
            var id1 = historyUrlArray[i];
            var id2 = id;
            var w = i;
            if (id1 == id2) {
                fnAudio(i);
            }
        }
    });
}
// function fnAudioluyin(i) {
//     play = i;
//     fnBoFangluyin();
// }
function fnAudio(i) {
    play = i;
    fnBoFangSouSuoyinpinxinxi();
}
//上一首
function fnShangYi() {
    var myAudio = document.getElementById("myAudio");
    myAudio.currentTime = 0;
    netAudioPause();
    play = play - 1;
    if (play == 0) {
        play = historyUrlArray.length - 1;
    }
    fnBoFangSouSuoyinpinxinxi();
}
//下一首
function fnxiaYi() {
    var myAudio = document.getElementById("myAudio");
    myAudio.currentTime = 0;
    netAudiopause();
    play = play + 1;
    if (play > historyUrlArray.length - 1) {
        play = 1;
    }
    fnBoFangSouSuoyinpinxinxi();
}

//歌单上一首
function fnGeDanShangYi() {
    var myAudio = document.getElementById("myAudio");
    netAudioStop();
    clearInterval(timer1);
    play--;
    if (play < 0) {
        play = ret.data.length - 1;
    }
    fnBoFangyinpinxinxi(play);
}
//歌单下一首
function fnGeDanxiaYi() {
    var myAudio = document.getElementById("myAudio");

    netAudioStop();
    clearInterval(timer1);
    play++;
    if (play > rets.data.length - 1) {
        play = 0;
    }
    fnBoFangyinpinxinxi(play);
}
//获取歌单歌曲id
function netPlayLieIdUrl(playlistid) {
    api.ajax({
        url: 'http://47.100.11.38/kongmeng/thirdParty/get_songs_by_playlist.php?playlistid= ' + playlistid,
        // url: 'http://47.100.11.38/kongmeng/thirdParty/get_songs_by_playlist.php?page=0&size=10&playlistid= ' + playlistid,
        method: 'get',
    }, function(ret, err) {
        if (ret) {
            fnTingdanZhanshi(ret);
        } else {
            alert(JSON.stringify(err));
        }
    });
}
//当前播放id
function fnBFid(id) {
    DangQianbofangid = id;
}
var Guid = new Array();
//获取 草稿箱列表歌曲
// var cgxid;
function netPlayLieCgx(cgxnewid) {

    api.getPrefs({
        key: 'cgxlist'
    }, function(ret, err) {
        var historyUrlText = '' || ret.value;
        historyUrlArray = historyUrlText.split(',');
        // console.log('111');
        cgxPlay(cgxnewid);
    });
    // fnTingdanZhanshi(cgxid,title,name);
}


function cgxPlay(cgxnewid) {
    var cgxnewids = cgxnewid - 1;
    ret = '';
    var length = historyUrlArray.length - 1;

    for (var i = 0; i < length / 4 + 1; i++) {
        if (historyUrlArray[i].length == 0)
            continue;

        caogaoId = '';
        caogaoId += historyUrlArray[i * 4 - 3];
        // console.log(caogaoId);
        caogaoTitle = '';
        caogaoTitle += historyUrlArray[i * 4 - 2];
        caogaoName = '';
        caogaoName += historyUrlArray[i * 4 - 1];
        caogaoBody = '';
        caogaoBody += historyUrlArray[i * 4];

        dataArray.push({
            "id": caogaoId,
            "name": caogaoTitle,
            "singerName": caogaoName,
            "desc": caogaoBody
        });
        rets = {
            "data": dataArray
        };

        // console.log(ret.data[i].id);
        // console.log(cgxnewids);
        fnDQBF(cgxnewids);

    }
    // console.log(JSON.stringify(ret));



}
// //草稿箱  当前播放
// function fnBFcgx(id) {
//
//     DangQianbofangid = id;
//     // console.log(DangQianbofangid);
// }
function fnDQBF(y) {
    play = y;
    fnBoFangyinpinxinxi(play);
}

function fnTingdanZhanshi(data_) {
    rets = data_;
    for (y = 0; y < rets.data.length; y++) {
        var id1 = rets.data[y].id;
        var id2 = DangQianbofangid;
        if (id1 == id2) {
            clearInterval(timer1);
            fnDQBF(y);
        }
    }
}

//     function fnTingdanZhanshi(data_) {
//     // console.log(data_.data);
//         //ret = data_;
//         for (y = 0; y < data_.data.length; y++) {
//             var id1 = data_.data[y];
// // console.log(id1);
//             var id2 = DangQianbofangid;
// // console.log(id2);
//             if (id1 == id2) {
//               // console.log(id1);
//               console.log(y);
//                 clearInterval(timer2);
//                 clearInterval(timer1);
//                 fnDQBF(y);
//             }
//         }
//         // console.log(y);
//     }
//随机播放歌曲
function suiji() {
    clearInterval(shunxuplays);
    clearInterval(danquplays);
    var n = Math.ceil(Math.random() * rets.data.length);
    suijiplays = setInterval(function() {
        var audioPlayer = api.require('audioPlayer');
        audioPlayer.getState(function(ret) {
            // api.alert({ msg: ret.state });
            if (ret.state == 'finished') {
                //console.log(n);
                bofangmoshiid = 1;
                if (n == rets.data.length) {
                    n == rets.data.length - 1;
                    fnSuiJiBoFangMoShiGeQuid(n);
                } else {
                    fnSuiJiBoFangMoShiGeQuid(n);
                }

            }
        });
    }, 200);
}
//顺序播放
function shunxu() {
    var myAudio = document.getElementById("myAudio");
    clearInterval(danquplays);
    clearInterval(suijiplays);
    shunxuplays = setInterval(function() {
        var audioPlayer = api.require('audioPlayer');
        audioPlayer.getState(function(ret) {
            // api.alert({ msg: ret.state });
            if (ret.state == 'finished') {
              bofangmoshiid = 0;
                fnGeDanxiaYi();
            }
        });
    }, 200);

}
//单曲播放
function bfdanqu() {
    var myAudio = document.getElementById("myAudio");
    clearInterval(suijiplays);
    clearInterval(shunxuplays);
    danquplays = setInterval(function() {
        var audioPlayer = api.require('audioPlayer');
        audioPlayer.getState(function(ret) {
            // api.alert({ msg: ret.state });
            // console.log(ret.state);
            var finished = "finished";
            if(ret.state == finished){

                bofangmoshiid = 2;
                  fndanqubofangmoshi();

            }
          return false;
        });
    }, 200);
}
//随机播放歌曲跟新
function fnSuiJiBoFangMoShiGeQuid(n) {
    play = n;
    netAudiopause();
    clearInterval(timer1);
    fnBoFangyinpinxinxi(play);
}
//单曲循环播放更新
function fndanqubofangmoshi() {
    // netAudiopause();
    // console.log('111');
    clearInterval(timer1);

    fnBoFangyinpinxinxi();
}

function fnBFMoshi(MoShiId) {
    bofangmoshiid = MoShiId;
    console.log(bofangmoshiid);
    fnBoFangmoshiid();
}

//判断播放模式
function fnBoFangmoshiid() {
  // console.log(bofangmoshiid);
  // console.log();
    if (!bofangmoshiid) {
        shunxu();
    } else {
        if (bofangmoshiid == '0') {
            shunxu();
        } else if (bofangmoshiid == '1') {
            suiji();
        } else if (bofangmoshiid == '2'){
          // console.log('333333');
            bfdanqu();
        }
    }
}

function fnBOFangJian(bofangs, aa, playlist) {
    if (playlistid) {
        a = aa;
        bofang = bofangs;
        playlistid = playlist;
    } else {
        a = aa;
        bofang = bofangs;
    }
}
//调整播放进度
function adjust() {
    api.addEventListener({
        name: 'playTime'
    }, function(ret, err) {
        if (ret) {
            playTime = ret.value.playTime;
            var audioPlayer = api.require('audioPlayer');
            audioPlayer.setCurrent({
                current: playTime
            });
        }
    });
}
//监听播放模式
function initEventListennerBoFangMoshi() {
    // api.addEventListener({
    //     name: 'bofangmoshiluyin'
    // }, function(ret, err) {
    //     if (ret) {
    //         // fnBFMoshi(ret.value.bofangmoshi);
    //         fnBFMoshiLuYin(ret.value.bofangmoshi);
    //         // console.log(ret.value.bofangmoshi);
    //     }
    // });
    //监听播放模式
    api.addEventListener({
        name: 'bofangmoshi'
    }, function(ret, err) {
        if (ret) {
            fnBFMoshi(ret.value.bofangmoshi);
            // console.log(ret.value.bofangmoshi);
            // fnBFMoshiLuYin(ret.value.bofangmoshi);
        }
    });

}

function initEventListennerBofang(){
  api.addEventListener({
      name: 'netPlayUrl'
  }, function(ret, err) {
      if (ret) {
          fnBFid(ret.value.id);
      }
  });

  //监听url
  api.addEventListener({
      name: 'netUrl'
  }, function(ret, err) {
      if (ret) {
          // console.log(ret.value.id);
          netUrl(ret.value.id);
      }
  });
  api.addEventListener({
      name: 'netPlayLieIdUrl'
  }, function(ret, err) {
      if (ret) {
          // console.log(ret.value.playlistid);
          netPlayLieIdUrl(ret.value.playlistid);
      }
  });
  // 草稿箱  当前播放
  api.addEventListener({
      name: 'netPlayCgx'
  }, function(ret, err) {
      if (ret) {
          // console.log(ret.value.id);
          // fnBFcgx(ret.value.id);
          netPlayLieCgx(ret.value.id);
      }
  });
  // 草稿箱  当前播放
  api.addEventListener({
      name: 'netPlayingCgx'
  }, function(ret, err) {
      if (ret) {
          // console.log(ret.value.id);
          // fnBFcgx(ret.value.id);
          fnBoFangyinpinxinxiing(ret.value.id)
      }
  });
  //监听暂停音频
  api.addEventListener({
      name: 'netAudioPause'
  }, function(ret, err) {
      if (ret) {
          netAudioPause();
      }
  });
  //上一首
  api.addEventListener({
      name: 'bofangshangyi'
  }, function(ret, err) {
      if (ret) {
          fnShangYi();
      }
  });
  //下一首
  api.addEventListener({
      name: 'bofangxiayi'
  }, function(ret, err) {
      if (ret) {
          fnGeDanxiaYi();
      }
  });
  //上一首
  api.addEventListener({
      name: 'GeDanshangyi'
  }, function(ret, err) {
      if (ret) {
          fnGeDanShangYi();
      }
  });
  //下一首
  api.addEventListener({
      name: 'GeDanxiayi'
  }, function(ret, err) {
      if (ret) {
          fnGeDanxiaYi();
      }
  });
  api.addEventListener({
      name: 'neizhiliebiaoPlay'
  }, function(ret, err) {
      var bofang = ret.value.bofang;
      var a = ret.value.a;
      // console.log(a);
      var playlistid = ret.value.playlistid;
      // console.log(bofang);
      if (playlistid) {
          fnBOFangJian(bofang, a, playlistid);
      } else {
          fnBOFangJian(bofang, a);
      }
  });
  // api.addEventListener({
  //     name: 'neizhiliebiaoPlay'
  // }, function(ret, err) {
  //     var a;
  //     var bofang = JSON.stringify(ret.value.bofang);
  //     console.log(bofang);
  //     a = ret.value.a;
  //     var playlistid = ret.value.playlistid;
  //     if (playlistid) {
  //         fnBOFangJian(bofang, a, playlistid);
  //     } else {
  //         fnBOFangJian(bofang, a);
  //     }
  // });
  api.addEventListener({
      name: 'netPlay'
  }, function(ret, err) {
      netAudioPlaying();
      // var id = ret.value.a;
      // console.log(id);
      //   if(id == aa){
      //     // fnJinRuBofangs(aa);
      //
      //   }
      //   return false;
  });
}