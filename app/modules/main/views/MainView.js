'use strict'

class MainView {
    constructor() {

    }

    showFirstScreen() {
        return `
        <html>
	<head>
		<script src="http://code.jquery.com/jquery-latest.min.js"></script>
	</head>

	<body>
		<h2>Check your dependencies</h2>
		
		<form id="form">
			<input id="id" type="text" name="id" placeholder="Github url" />
			<input id="input" type="submit" name="submit" value="Count It" />
		</form>
		
		<div id="result"></div>
		
		<script>
			$.ajaxSetup({
				contentType: "application/json; charset=utf-8",
				dataType: "json"
			});
			$(document).ready(function(){
				$('#input').click(function() {
					$.ajax({
						url: "/count?url="+$("#id").val(),
						type: "POST",
						error: function(xhr, error) {
							alert('Error!  Status = ' + xhr.status + ' Message = ' + error);
						},
						success: function(data) {
							$('#result').html('Badge link: <a href='+data.link+'>'+data.link+'</a>');
						}
					});
					return false; 
				});
			});
		</script>
	</body>
</html>
        `
    }
}

module.exports = MainView