/**
 * Created by Administrator on 2015/11/10.
 */
apiready = function () {
    var clear = $api.byId('clear');
    $api.addEvt(clear, 'click', function () {
        ClearHistory();
    });
    InitHistory();

};

function InitHistory() {
    var history = $api.byId('history');
    api.getPrefs({
        key: 'historys'
    }, function (ret, err) {
        var historyText = ret.value || '';
        var historyArray = historyText.split(',');
        var li = '<li class="history" data-index="{index}">{text}<img class="historyImg" src="../image/x.png" alt="" style="float: right;" onclick="ClearHistory({index})"></li>';
        for (var i = 0; i < historyArray.length; i++) {
            if (historyArray[i].length == 0)
                continue;
            var tempLi = li.replace(/\{index\}/g, i);
            tempLi = tempLi.replace(/\{text\}/g, decodeURIComponent(historyArray[i]));

            history.appendHTML(tempLi);

        }
    });
}


function ClearHistory(index) {
    var history = $api.byId('history');
    if (!index) {
        history.innerHTML = '';
        api.removePrefs({
            key: 'historys'
        });
        api.toast({
            msg: '已清空所有历史记录'
        });
    } else {
        api.getPrefs({
        }, function (ret, err) {
            var historyText = ret.value;
            var historyArray = historyText.split(',');
            historyArray.splice(index, 1);
            api.setPrefs({
                key: 'historys',
                value: historyArray.join(',')
            });


            api.toast({
                msg: '已清除历史记录'
            });
            historys.go(0);
            // //location.reload();
            // history.innerHTML = '';
            // InitHistory()
        });
    }
}

function AppendHistory(text) {
    var history = $api.byId('history');
    var a = history.children.length;
    var index = a + 1;
    var li = '';
    var li = '<li class="history" data-index="' + index + '">' + text + '<img class="historyImg" src="../image/x.png" alt="" style="float: right;" onclick="ClearHistory(' + index + ')"></li>';
    history.appendHTML(li);

}
function fnshanchulishijilu(){
  var ul = document.getElementById('history');
  var ul_lis = ul.getElementsByClassName('historyImg');
  var ul_lisdiv = ul.getElementsByClassName('history');
  for (i = 0; i < ul_lis.length; i++) {
      ul_lis[i].index = i;
      ul_lis[i].onclick = function() {
          var j = this.index;
            var text = ul_lisdiv[j].innerHTML;
            var a = text.slice(0,-74);
            alert(a);
      }
  }
}
document.addEventListener('click', function (e) {
    var target = e.target;
    var targetClassName = target.className && target.className.trim().toLowerCase() || null;
    if (targetClassName == 'history') {
        api.openWin({
            name: 'result',
            url: '../html/result1.html',
            delay: 500,
            pageParam: {
                text: target.innerText,
                addHistory: true
            }
        });

    }
}, false);
