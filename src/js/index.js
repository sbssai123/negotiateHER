$(document).ready(function(){
  $('text.toshow').fadeIn(2200);
  $("#enter").on('click', function(event) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: document.body.scrollHeight - 850
      }, 1700);
  });
});

$(window).scroll(function () {
    console.log($(window).scrollTop());
    var topDivHeight = $("#foo-bar").height();
    var viewPortSize = $(window).height();

    var triggerAt = 1000;
    var triggerHeight = (topDivHeight - viewPortSize) + triggerAt;

    if ($(window).scrollTop() >= triggerHeight) {
        $('#foo-bar-1').css('visibility', 'visible').hide().fadeIn(1500);
        $('#foo-bar-2').css('visibility', 'visible').hide().fadeIn(3200);
        $(this).off('scroll');
    }
});


$.getJSON('/data/salary_gender', function(data) {

  let avg_female = [];
  let avg_male = [];
  let age_min = [];
  let age_max = [];

  for (i = 0; i < data.length; i++) {
    avg_female[i] = data[i]["Average of FEMALE HOURLY RATE"];
    avg_male[i] = data[i]["Average of MALE HOURLY RATE"];
    age_min[i] = data[i]["Age MIN"];
    age_max[i] = data[i]["Age MAX"];

  }

  d3.select(".chart")
    .selectAll("div")
    .data(avg_female)
      .enter()
      .append("div")
      .style("width", function(d) { return d * 10 + 'px' })
      .text(function(d) { return '$ ' + d; });

});

var $select = $('#occupation');
$.getJSON('/data/salary_occupation', function(data) {
for (i = 0; i < data.length; i++) {
  var $option = '<option id="' + "occupation" + i + '">' + data[i]["OCC_TITLE"] + '</option>'
  $select.append($option);
  const occupation_data = data;
}
});

$("#submit-button").click(function() {
  // Get information from input and process it based off of your salary
  let salary_value = $("#salary").val();
  let occupation_value = $("#occupation").val();

})
