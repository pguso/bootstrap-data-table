Bootstrap Data Table
====================

- sorting, pagination and search for tables
- bootstrap framework is used for the styling, in the bootstrap data table css file there are only a view lines like positioning elements
- fontawesome arrow icons are used for sorting, you can choose the arrows you like the most

How to use
----------

Include bootstrap data table, bootstrap framework and sorting plugin & jquery to your Site

    <link href="css/bootstrap.min.css" type="text/css" rel="stylesheet">
    <link href="css/font-awesome.min.css" type="text/css" rel="stylesheet">
    <link href="css/jquery.bdt.css" type="text/css" rel="stylesheet">
    
    <script src="http://code.jquery.com/jquery-2.1.1.min.js" type="text/javascript"></script>
    <script src="js/bootstrap.min.js" type="text/javascript"></script>
    <script src="js/jquery.sortelements.js" type="text/javascript"></script>
    <script src="js/jquery.bdt.js" type="text/javascript"></script>

Turn your table into a bootstrap data table

    <script>
    $(document).ready( function () {
        $('#bootstrap-table').bdt();
    });
    </script>
