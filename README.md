Bootstrap Data Table
====================

- sorting, pagination and search for tables
- bootstrap framework is used for the styling, in the bootstrap data table css file there are only a view lines like positioning elements
- fontawesome arrow icons are used for sorting, you can choose the arrows you like the most

Preview 
-------

<img src="preview/screenshot-localhost 2015-11-18 18-34-50.png">

This is how the styled example look like, if you want to have a "blank" bootstrap table and style it how you like it just remove the style.css file.

How to use
----------

Include bootstrap data table, bootstrap framework and sorting plugin & jquery to your Site

    <link href="css/vendor/bootstrap.min.css" type="text/css" rel="stylesheet">
    <link href="css/vendor/font-awesome.min.css" type="text/css" rel="stylesheet">
    <link href="css/jquery.bdt.css" type="text/css" rel="stylesheet">
    
    <script src="http://code.jquery.com/jquery-2.1.1.min.js" type="text/javascript"></script>
    <script src="js/vendor/bootstrap.min.js" type="text/javascript"></script>
    <script src="js/jquery.sortelements.js" type="text/javascript"></script>
    <script src="js/jquery.bdt.js" type="text/javascript"></script>

Turn your table into a bootstrap data table

    <script>
    $(document).ready( function () {
        $('#bootstrap-table').bdt();
    });
    </script>

Available Options
-----------------

- pageRowCount / initial row count per page / default is 10
- arrowDown / font awesome arrow down icon / default is "fa-angle-down"
- arrowUp / font awesome arrow up icon / default is "fa-angle-up"
 
Disable sorting for several columns with the css class disable-sorting

    <th class="disable-sorting">#ID</th>
