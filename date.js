//jshint eversion:6

exports.getDate = function() {
    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    const currentDay = today.toLocaleDateString("en-IN", options);
    return currentDay;
}

exports.getDay = function() {
    const today = new Date();

    const options = {
        weekday: "long",
    };

    const day = today.toLocaleDateString("en-IN", options);
    return day;
}