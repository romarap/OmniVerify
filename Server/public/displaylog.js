$(document).ready(function() {
    var Application = function() {
        var socket = io.connect('/');
        var container = $('#container');

        //var socket = new io.Socket();
        //socket.connect('http://127.0.0.1:8000'); 
        var lines = 0;

        socket.on('connect', function() {
        console.log('Connected to:', socket.host);
        });

        socket.on('announcements', function(data) {
        $('#info').html(  data.message );
        });

        socket.on('message', function(message) {
        console.log('Received message:', message);
        if (message.value) {
            var newItem = $('<div>' + message.value + '</div>');
            container.append(newItem);
        }
        });
        
        return {
        socket : socket
        };
    };
    
    var app = Application(); 
});