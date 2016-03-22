
function fetchData() {
    var twitterHandle = document.getElementById("twitter_input").value;
    var url = "/tweet?twitterHandle=" + twitterHandle;
    window.location = url;

};

function sortByCount() {
  
    $($("#tweets > .tweet").toArray().sort(function (a, b) {
        return $(b).attr('data-count') - $(a).attr('data-count');
    })).appendTo("#tweets");
};

function sortByDate() {
      $($("#tweets > .tweet").toArray().sort(function (a, b) {
        var dateA = $(b).attr('data-date');
        var dateB = $(a).attr('data-date');
        var formattedA = new Date(dateA);
        var formattedB = new Date(dateB);
        return formattedA > formattedB;
    })).appendTo("#tweets");
}

function init() {
    console.log("javascript initialized DEV");
    //sort by date first
    sortByDate();
    //event handlers
    $('#submit_button').on('click', fetchData);
    $('#sort_button').on('click', sortByCount);
    $('#sort_date_button').on('click', sortByDate);
    $('#sort_select').on('change', function () {
        if ($(this).val() == 'retweets')
            sortByCount();
        else if ($(this).val() == 'date')
            sortByDate();
        else
            console.log("error in selecting sorting");
    });
    $('#img_check').on('click', function () {
        if (this.checked) {
            console.log("changing css");
            $('.tweet img').each(function () {
                console.log("changing css");
                $(this).css("display", 'inline-block');
            });
        }
        else {
            console.log("changing css");
            $('.tweet img').each(function () {
                console.log("changing css");
                $(this).css("display", 'none');
            });
        }
    });
    $('#twitter_input').on('keyup', function (e) {
        if (e.keyCode == 13)
            fetchData();
    });

};

$(document).on('ready', init);