/**
 * @license MIT
 * @license http://opensource.org/licenses/MIT Massachusetts Institute of Technology
 * @copyright 2014 Patric Gutersohn
 * @author Patric Gutersohn
 * @example index.html BDT in action.
 * @link http://bdt.gutersohn.biz Documentation
 * @version 1.0.0
 *
 * @summary BDT - Bootstrap Data Tables
 * @description sorting, paginating and search for bootstrap tables
 */

(function ($) {
    "use strict";

    /**
     * @type {number}
     */
    var actualPage = 1;
    /**
     * @type {number}
     */
    var pageCount = 0;
    /**
     * @type {number}
     */
    var pageRowCount = 0;
    /**
     * @type {string}
     */
    var pages = '';
    /**
     * @type {object}
     */
    var obj = null;
    /**
     * @type {boolean}
     */
    var activeSearch = false;
    /**
     * @type {string}
     */
    var arrowUp = '';
    /**
     * @type {string}
     */
    var arrowDown = '';
    /**
     * @type {string}
     */
    var searchFormClass = '';
    /**
     * @type {string}
     */
    var pageFieldText = '';
    /**
     * @type {string}
     */
    var searchFieldText = '';

    $.fn.bdt = function (options, callback) {

        var settings = $.extend({
            pageRowCount: 10,
            arrowDown: 'fa-angle-down',
            arrowUp: 'fa-angle-up',
            searchFormClass: 'pull-left search-form',
            pageFieldText: 'Entries per Page:',
            searchFieldText: 'Search'
        }, options);

        /**
         * @type {object}
         */
        var tableBody = null;

        return this.each(function () {
            obj = $(this).addClass('bdt');
            tableBody = obj.find("tbody");
            pageRowCount = settings.pageRowCount;
            arrowDown = settings.arrowDown;
            arrowUp = settings.arrowUp;
            searchFormClass = settings.searchFormClass;
            pageFieldText = settings.pageFieldText;
            searchFieldText = settings.searchFieldText;

            /**
             * search input field
             */
            obj.before(
                $('<div/>')
                    .addClass('table-header')
                    .append(
                        $('<form/>')
                            .addClass(searchFormClass)
                            .attr('role', 'form')
                            .append(
                                $('<div/>')
                                    .addClass('form-group')
                                    .append(
                                        $('<input/>')
                                            .addClass('form-control')
                                            .attr('id', 'search')
                                            .attr('placeholder', searchFieldText)
                                    )
                            )
                    )
                    .append(
                        $('<div/>')
                            .addClass('pull-left')
                            .append(
                                $('<form/>')
                                    .addClass('form-horizontal')
                                    .attr('id', 'page-rows-form')
                                    .append($('<label/>')
                                        .addClass('pull-left control-label')
                                        .text(pageFieldText)
                                    )
                                    .append(
                                        $('<div/>')
                                            .addClass('pull-left')
                                            .append(
                                                $('<select/>')
                                                    .addClass('form-control')
                                                    .append(
                                                        $('<option>', {
                                                            value: 5,
                                                            text: 5
                                                        })
                                                    )
                                                    .append(
                                                        $('<option>', {
                                                            value: 10,
                                                            text: 10,
                                                            selected: 'selected'
                                                        })
                                                    )
                                                    .append(
                                                        $('<option>', {
                                                            value: 15,
                                                            text: 15
                                                        })
                                                    )
                                                    .append(
                                                        $('<option>', {
                                                            value: 20,
                                                            text: 20
                                                        })
                                                    )
                                                    .append(
                                                        $('<option>', {
                                                            value: 25,
                                                            text: 25
                                                        })
                                                    )
                                            )
                                    )
                            )
                    )
            );

            /**
             * select field for changing row per page
             */
            obj.after(
                $('<div/>')
                    .attr('id', 'table-footer')
                    .append(
                        $('<div/>')
                            .addClass('pull-left table-info')
                            //.text('Showing 1 to 10 of 100 entries')
                    )
                    
            );

            if (tableBody.children('tr').length > pageRowCount) {
                setPageCount(tableBody);
                addPages();
                paginate(tableBody, actualPage);
            }

            searchTable(tableBody);
            sortColumn(obj, tableBody);

            $('body').on('click', '.pagination li', function (event) {
                var listItem;

                if ($(event.target).is("a")) {
                    listItem = $(event.target).parent();
                } else {
                    listItem = $(event.target).parent().parent();
                }

                var page = listItem.data('page');

                if (!listItem.hasClass("disabled") && !listItem.hasClass("active")) {
                    paginate(tableBody, page);
                }
            });

            $('#page-rows-form').on('change', function () {
                var options = $(this).find('select');
                pageRowCount = options.val();

                setPageCount(tableBody);
                addPages();
                paginate(tableBody, 1);
            });

        });

        /**
         * the main part of this function is out of this thread http://stackoverflow.com/questions/3160277/jquery-table-sort
         * @author James Padolsey http://james.padolsey.com
         * @link http://jsfiddle.net/spetnik/gFzCk/1953/
         * @param obj
         */
        function sortColumn(obj) {
            var table = obj;
            var oldIndex = 0;

            obj
                .find('thead th')
                .wrapInner('<span class="sort-element"/>')
                .append(
                    $('<span/>')
                        .addClass('sort-icon fa')
                )
                .each(function () {

                    var th = $(this);
                    var thIndex = th.index();
                    var inverse = false;
                    var addOrRemove = true;

                    th.click(function () {
                        if(!$(this).hasClass('disable-sorting')) {
                            if($(this).find('.sort-icon').hasClass(arrowDown)) {
                                $(this)
                                    .find('.sort-icon')
                                    .removeClass( arrowDown )
                                    .addClass(arrowUp);

                            } else {
                                $(this)
                                    .find('.sort-icon')
                                    .removeClass( arrowUp )
                                    .addClass(arrowDown);
                            }

                            if(oldIndex != thIndex) {
                                obj.find('.sort-icon').removeClass(arrowDown);
                                obj.find('.sort-icon').removeClass(arrowUp);

                                $(this)
                                    .find('.sort-icon')
                                    .toggleClass( arrowDown, addOrRemove );
                            }

                            table.find('td').filter(function () {

                                return $(this).index() === thIndex;

                            }).sortElements(function (a, b) {

                                return $.text([a]) > $.text([b]) ?
                                    inverse ? -1 : 1
                                    : inverse ? 1 : -1;

                            }, function () {

                                // parentNode is the element we want to move
                                return this.parentNode;

                            });

                            inverse = !inverse;
                            oldIndex = thIndex;
                        }
                    });

                });
        }

        /**
         * create li elements for pages
         */
        function addPages() {
            $('#table-nav').remove();
            pages = $('<ul/>');

            $.each(new Array(pageCount), function (index) {
                var additonalClass = '';
                var page = $();

                if ((index + 1) == 1) {
                    additonalClass = 'active';
                }

                pages
                    .append($('<li/>')
                        .addClass(additonalClass)
                        .data('page', (index + 1))
                        .append(
                            $('<a/>')
                                .text(index + 1)
                        )
                    );
            });

            /**
             * pagination, with pages and previous and next link
             */
            $('#table-footer')
                .addClass('row')
                .append(
                    $('<nav/>')
                        .addClass('pull-right')
                        .attr('id', 'table-nav')
                        .append(
                            pages
                                .addClass('pagination pull-right')
                                .prepend(
                                    $('<li/>')
                                        .addClass('disabled')
                                        .data('page', 'previous')
                                        .append(
                                            $('<a href="#" />')
                                                .append(
                                                    $('<span/>')
                                                        .attr('aria-hidden', 'true')
                                                        .html('&laquo;')
                                                )
                                                .append(
                                                    $('<span/>')
                                                        .addClass('sr-only')
                                                        .text('Previous')
                                                )
                                        )
                                )
                                .append(
                                    $('<li/>')
                                        .addClass('disabled')
                                        .data('page', 'next')
                                        .append(
                                            $('<a href="#" />')
                                                .append(
                                                    $('<span/>')
                                                        .attr('aria-hidden', 'true')
                                                        .html('&raquo;')
                                                )
                                                .append(
                                                    $('<span/>')
                                                        .addClass('sr-only')
                                                        .text('Next')
                                                )
                                        )
                                )
                        )
                );

        }

        /**
         *
         * @param tableBody
         */
        function searchTable(tableBody) {
            $("#search").on("keyup", function () {
                $.each(tableBody.find("tr"), function () {

                    var text = $(this)
                        .text()
                        .replace(/ /g, '')
                        .replace(/(\r\n|\n|\r)/gm, "");

                    var searchTerm = $("#search").val();

                    if (text.toLowerCase().indexOf(searchTerm.toLowerCase()) == -1) {
                        $(this)
                            .hide()
                            .removeClass('search-item');
                    } else {
                        $(this)
                            .show()
                            .addClass('search-item');
                    }

                    if (searchTerm != '') {
                        activeSearch = true;
                    } else {
                        activeSearch = false;
                    }
                });

                setPageCount(tableBody);
                addPages();
                paginate(tableBody, 1);
            });
        }

        /**
         *
         * @param tableBody
         */
        function setPageCount(tableBody) {
            if (activeSearch) {
                pageCount = Math.ceil(tableBody.children('.search-item').length / pageRowCount);
            } else {
                pageCount = Math.ceil(tableBody.children('tr').length / pageRowCount);
            }

            if (pageCount == 0) {
                pageCount = 1;
            }
        }

        /**
         *
         * @param tableBody
         * @param page
         */
        function paginate(tableBody, page) {
            if (page == 'next') {
                page = actualPage + 1;
            } else if (page == 'previous') {
                page = actualPage - 1;
            }

            actualPage = page;

            var rows = (activeSearch ? tableBody.find(".search-item") : tableBody.find("tr"));
            var endRow = (pageRowCount * page);
            var startRow = (endRow - pageRowCount);
            var pagination = $('.pagination');

            rows
                .hide();

            rows
                .slice(startRow, endRow)
                .show();

            pagination
                .find('li')
                .removeClass('active disabled');

            pagination
                .find('li:eq(' + page + ')')
                .addClass('active');

            if (page == 1) {
                pagination
                    .find('li:first')
                    .addClass('disabled');

            } else if (page == pageCount) {
                pagination
                    .find('li:last')
                    .addClass('disabled');
            }
        }
    }
}(jQuery));