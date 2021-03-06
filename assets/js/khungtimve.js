var lastDomesticAiport = "H&#224; Nội (HAN)";
    var lastInterAirport = "Bangkok (BKK)";

    $(document).ready(function () {
		
		
        $("#airport-autocomplete").autocomplete({
            delay: 500,
            minLength: 1,
            source: function (request, response) {
                $.ajax({
                    cache: false,
                    type: 'post',
                    url: "/Flight/AirportSearchAutocomplete",
                    dataType: "json",
                    data: {
                        term: request.term,
                        product_type: $("#airport-autocomplete").val()
                    },
                    success: function (data) {
                        response(data);
                    }
                });
            },
            select: function (event, ui) {
                var active = $("#airport-select").attr("active");
                $("#" + active).val(ui.item.Name);
                $("#airport-autocomplete").val('');
                if (active == "DepartureAirport") {
                    $("#ArrivalAirport").trigger("click");
                }
                else {
                    $('#airport-list').dialog("close");
                    //$('#airport-list-international').dialog("close");
                    $('#DepartureDate').datepicker("show");
                }
            }
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            ul.addClass('Airport');
            var html = "<a><span class='flight-search-name'>" + item.Name + "</span><b class='flight-search-country'>" + item.Country + "</b></a>";
            return $("<li></li>").data("item.autocomplete", item).append(html).appendTo(ul);
        };

        $('#ReturnDate').datepicker({
            dateFormat: "dd/mm/yy",
            ParseFormats: "dd/mm/yy",
            minDate: new Date("2017-03-28")
        });
        $('#DepartureDate').datepicker({
            dateFormat: "dd/mm/yy",
            ParseFormats: "dd/mm/yy",
            minDate: new Date("2017-03-27"),
            onSelect: function (dateText) {
                var s = dateText.split("/");
                var date = new Date(s[2], s[1] - 1, s[0]);
                var newDate = new Date(date);

                $('#ReturnDate').datepicker('option', 'minDate', newDate);
                date.setDate(date.getDate() + 3);
                $('#ReturnDate').datepicker('setDate', date);
                if ($("#round-trip").is(":checked")) {

                    setTimeout(function () {
                        $('#ReturnDate').datepicker("show");
                    }, 16);

                }
            }
        });

        if ($.datepicker != undefined) {
            $.datepicker.setDefaults($.datepicker.regional['vn']);
        }

        $('#DepartureDate').datepicker('setDate', new Date('2017-03-28'));
        $('#ReturnDate').datepicker('setDate', new Date('2017-03-31'));
        $('input:radio').change(
                    function () {
                        if ($("#round-trip").is(":checked")) {
                            $("#IsRoundTrip").val(true);
                            $("#return-date").show();
                        }
                        else if ($("#one-way").is(":checked")) {
                            $("#IsRoundTrip").val(false);
                            $("#return-date").hide();
                        }
                    }
                );

        $('#airport-list').dialog(
                {
                    autoOpen: false,
                    show: {
                        effect: "fade",
                        duration: 150
                    },
                    hide: {
                        effect: "fade",
                        duration: 150
                    },
                    width: 584,
                    dialogClass: "airport-dialog",
                    clickOutside: true,
                    clickOutsideTrigger: ".Airport"
                }

            );



        $('.Airport').click(function () {

            $('.listCity').attr("active", $(this).attr("id"));
            $('#airport-select').attr("active", $(this).attr("id"));

            $('#airport-list').css({ overflow: "auto", position: "absolute" }).dialog("option", "position", [$(this).position().left - 2, $(this).position().top + $(this).height() + 5 - $(window).scrollTop()]);
            $('#airport-list').dialog("open");
        });

        $(".listCity ul li a").click(function () {
            var active = $("#airport-select").attr("active");
            $("#" + active).val($(this).text());
            if (active == "DepartureAirport") {
                $("#ArrivalAirport").trigger("click");
            }
            else {
                $('#airport-list').dialog("close");
                //$('#airport-list-domestic').dialog("close");
                $('#DepartureDate').datepicker("show");
            }
        });

      
    });