window.addEventListener('load',function() {
  if(window.cast){
    cast.receiver.logger.setLevelValue(0);
    window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
    console.log('Starting Receiver Manager');

    // handler for the 'ready' event
    castReceiverManager.onReady = function(event) {
      console.log('Received Ready event: ' + JSON.stringify(event.data));
      window.castReceiverManager.setApplicationState("Application status is ready...");
    };

    // handler for 'senderconnected' event
    castReceiverManager.onSenderConnected = function(event) {
      displayText(window.innerWidth + ' x ' + window.innerHeight);
      console.log('Received Sender Connected event: ' + event.data);
      console.log(window.castReceiverManager.getSender(event.data).userAgent);
    };

    // handler for 'senderdisconnected' event
    castReceiverManager.onSenderDisconnected = function(event) {
      console.log('Received Sender Disconnected event: ' + event.data);
      if (window.castReceiverManager.getSenders().length === 0) {
        window.close();
      }
    };

    // handler for 'systemvolumechanged' event
    castReceiverManager.onSystemVolumeChanged = function(event) {
      console.log('Received System Volume Changed event: ' + event.data.level + ' ' +
                  event.data.muted);
    };

    // create a CastMessageBus to handle messages for a custom namespace
    window.messageBus =
      window.castReceiverManager.getCastMessageBus(
        'urn:x-cast:com.devmountain.helloworld');

    // handler for the CastMessageBus message event
    window.messageBus.onMessage = function(event) {
      console.log('Message [' + event.senderId + ']: ' + event.data);
      // display the message from the sender
      displayText(event.data);
      // inform all senders on the CastMessageBus of the incoming message event
      // sender message listener will be invoked
      window.messageBus.send(event.senderId, event.data);
    };

    // initialize the CastReceiverManager with an application status message
    window.castReceiverManager.start({statusText: "Application is starting"});
    console.log('Receiver Manager started');
  }else{
    alert("This app is designed to be served via chromecast, it won't work in a normal browser! Sorry!");
  }
}, false);

var x = 40;
var y = 50;
// utility function to display the text message in the input field
function displayText(text) {
  if(text === "left"){
    x -= 40;
  }

  if(text === "right"){
    x += 40;
  }

  if(text === "up"){
    y -= 5;
  }

  if(text === "down"){
    y += 5;
  }

  document.getElementById("blob").style.left = x + 'px';
  document.getElementById("blob").style.top = y + 'px';

  document.getElementById("message").innerHTML=text;
  window.castReceiverManager.setApplicationState(text);
}
