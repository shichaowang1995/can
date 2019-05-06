$(function() {

  // Subscribe to the demo_tutorial channel
  pubnubDemo.addListener({
      message: function(message) {
          console.log(message)
      }
  })

  pubnubDemo.subscribe({
      channels: ['survey']
  });
  pubnubDemo.publish({
      message: {
          "color" : "blue"
      },
      channel: 'survey'
  });

  window.data = [{name: "coordinate with administrators", vote: 0},
                {name: "collabrate with teachers from multiple subjects", vote: 0},
                {name: "limited preparation time", vote: 0},
                {name: "find reliable sources", vote: 0},
                {name: "difficult to address safety issues", vote: 0},
                {name: "classroom management", vote: 0},
                {name: "facilitate students", vote: 0},
                {name: "exhibit students' work", vote: 0},
                {name: "store students' work", vote: 0},
                {name: "assess students' work", vote: 0}];

  window.pubnub = PUBNUB.init({
      channel: "survey",
      publish_key: "pub-c-e80e94c6-f7c0-4224-801d-639518ef589d",
      subscribe_key: "sub-c-643d8cfc-6fac-11e9-b50c-aee189a56456"
  });

  pubnub.subscribe({
    channel: 'survey',
    message: increment
  });

  function sendData(msg) {
    pubnub.publish({
        channel: 'survey',
        message: msg
    });
  }

  function draw(data) {
    var bars = d3.select(".container")
      .selectAll(".bar-wrapper")
      .data(data);
    var barEnter = bars
      .enter()
      .append("div")
      .attr("class", "bar-wrapper")
    barEnter
      .append("button")
      .text(function(d) { return "Vote "+ d.name; })
      .attr("class", "vote-btn btn-default btn-primary")
      .on("click", function(d) {
        sendData(d.name);
      });
    barEnter
      .append("div")
      .attr("class", "bar")
      .style("width", function (d) {
        return (d.vote*10)+15 + "px";
      })
      .text(function(d) { return d.vote });
    bars.selectAll("div")
      .text(function(d) { return d.vote })
      .style("width", function (d) {
        return (d.vote*10)+15 + "px";
      });
    bars
      .exit()
      .remove()
  };

  function increment(msg) {
    for (var i=0; i<window.data.length; i++) {
      var el = window.data[i];
      if (el.name == msg) {
        el.vote += 1;
      }
    }
    draw(data);
  }

  function init_votes() {
    pubnub.history({
      channel: 'survey',
      start: 0,
      callback: function(msg) {
        var vote_history = msg[0];
        for (var i=0; i<vote_history.length; i++) {
          increment(vote_history[i]);
        }
      }
    });
  }

  init_votes();
  draw(data);
});
