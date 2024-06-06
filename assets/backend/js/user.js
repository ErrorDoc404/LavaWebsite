(function ($) {
    'use strict';
    $(function () {
        var guildData;
        var table; // Declare table variable in a higher scope

        // Fetch data from API endpoint
        fetch('api/guild')
            .then(response => response.json())
            .then(data => {
                guildData = data.botGuilds;
                initializeDataTable(guildData); // Call function to initialize DataTable
            })
            .catch(error => console.error('Error fetching guild data:', error));

        function initializeDataTable(data) {
            table = $('#guildData').DataTable({
                "data": data, // Use guildData as the data source
                "columns": [
                    {
                        "data": "iconUrl",
                        "render": function (data, type, row) {
                            return data ? '<img src="' + data + '" alt="Guild Icon" style="max-width: 50px; max-height: 50px;">' : ''; // Render image if iconUrl exists
                        }
                    },
                    { "data": "id" },
                    { "data": "name" },
                    { "data": "memberCount" },
                    {
                        "data": "owner",
                        "render": function (data, type, row) {
                            return data ? 'Yes' : 'No'; // Render 'Yes' if owner is true, otherwise 'No'
                        }
                    },
                    {
                        "data": "config",
                        "render": function (data, type, row) {
                            return data ? JSON.stringify(data.musicChannelId) : 'N/A'; // Render the config object as a string
                        }
                    },
                    {
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    }
                ],
                "order": [[1, 'asc']],
                "paging": true,
                "ordering": true,
                "info": false,
                "filter": true,
                columnDefs: [{
                    orderable: false,
                    className: '',
                    targets: 0
                }],
                select: {
                    style: 'os',
                    selector: 'td:first-child'
                }
            });
        }

        $('#example tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child(format(row.data())).show();
                tr.addClass('shown');
            }
        });

    });
})(jQuery);
