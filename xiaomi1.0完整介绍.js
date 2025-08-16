auto.waitFor(); // 等待无障碍服务启动
device.setMusicVolume(0); // 静音
var d = new Date(); // 获取当前时间
notice(
  `开始执行抖音续火花`,
  `当前时间:${d.getFullYear()}年${
    d.getMonth() + 1
  }月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
); // 通知：脚本启动和时间

let startTime = new Date().getTime(); // 记录开始时间
sleep(5000); // 等待5秒
device.wakeUpIfNeeded(); // 唤醒设备

var friendNames = ["测试名称1", "测试名称2"]; // 好友昵称列表
var password = [1, 2, 3, 4, 5, 6]; // 屏幕解锁密码

// 屏幕解锁
function unlockScreen() {
  sleep(1000); // 等待1秒
  swipe(
    device.width / 2,
    device.height - 100,
    device.width / 2,
    device.height / 2,
    500
  ); // 向上滑动解锁
  sleep(1000); // 等待1秒
  for (let i = 0; i < password.length; i++) {
    let p = password[i].toString(); // 转字符串
    desc(p).findOne().click(); // 点击数字键
    sleep(200); // 等待0.2秒
  }
  sleep(2000); // 等待2秒
  openApp(); // 打开抖音
}

// 启动抖音App
function openApp() {
  app.launchApp("抖音"); // 启动抖音
  sleep(5000); // 等待5秒
  findUser(); // 查找好友
}

// 查找好友并发送消息
function findUser() {
  click("消息"); // 进入消息界面
  sleep(5000); // 等待5秒
  for (let i = 0; i < friendNames.length; i++) {
    click(friendNames[i]); // 点击好友
    sleep(3000); // 等待3秒
    sendMessage(); // 发送消息
  }
  sleep(3000); // 等待3秒
  killapp(); // 关闭抖音
}

// 发送消息
function sendMessage() {
  var content = "";
  var from = "";
  var res = http.get("https://v1.hitokoto.cn/"); // 获取一言内容
  if (res.statusCode == 200) {
    var data = res.body.json();
    content = data.hitokoto; // 消息内容
    from = data.from; // 消息出处
  } else {
    content = "今天网络不佳，没词了"; // 网络不佳时内容
  }
  setText(`${content} —— ${from}`); // 设置消息文本
  sleep(1000); // 等待1秒
  var button = desc("发送").findOne(); // 查找发送按钮
  click(button.bounds().centerX(), button.bounds().centerY()); // 点击发送
  sleep(1000); // 等待1秒
  back(); // 返回上一界面
}

// 关闭抖音App
function killapp() {
  recents(); // 打开最近任务
  sleep(1000); // 等待1秒

  let cards = textContains("抖音").find(); // 查找抖音卡片
  if (cards.nonEmpty()) {
    for (let i = 0; i < cards.size(); i++) {
      let card = cards.get(i);
      let bounds = card.bounds();
      let endY = Math.max(0, bounds.centerY() - 400);
      swipe(bounds.centerX(), bounds.centerY(), bounds.centerX(), endY, 700); // 上滑关闭
      sleep(500); // 等待0.5秒
    }
    sleep(1000); // 等待1秒
  } else {
    // 没找到卡片时，右侧上滑关闭
    let x = device.width - 50;
    let startY = device.height * 0.7;
    let endY = device.height * 0.3;
    swipe(x, startY, x, endY, 700);
    sleep(1000);
  }

  home(); // 返回桌面
  sleep(1000); // 等待1秒
  let runTime = new Date().getTime() - startTime; // 计算总耗时
  notice(`抖音续火花完成！`, `总耗时: ${runTime}毫秒`); // 通知完成
}

unlockScreen(); // 启动脚本，解锁屏幕
