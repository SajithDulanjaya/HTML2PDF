var html2pdf = angular.module("html2pdf", ["ionic"]);

html2pdf.controller("html2pdfCtrl", ["$scope", "$log", html2pdfCtrl]);

function html2pdfCtrl($scope, $log){

    $scope.generatePDF = function(){

        /*
         * rasterizeHTML to get html into a canvas
         */
        var canvas = document.getElementById("thecanvas"),
            context = canvas.getContext('2d'),
            html_container = document.getElementById("thehtml"),
            html = html_container.innerHTML;

        rasterizeHTML.drawHTML(html).then(function (renderResult) {
            context.drawImage(renderResult.image, 25, 10);
            try {
                console.log(canvas.toDataURL());
                var content = canvas.toDataURL('image/png');
                console.log("generating pdf...");
                //Generating pdf file
                var doc = new jsPDF();
                //Setting properties
                doc.setProperties({
                    title: 'Calcey',
                    subject: 'Test Subject',
                    author: 'Calcey',
                    creator: 'Calcey'
                });
                //Adding html content as a png image into the pdf file
                doc.addImage(content, 'PNG', 0, 0);
                doc.setFontSize(10);
                doc.text(188,290, 'Page ' + 01);
                var data = doc.output();
                var buffer = new ArrayBuffer(data.length);
                var array = new Uint8Array(buffer);

                for (var i = 0; i < data.length; i++) {
                    array[i] = data.charCodeAt(i);
                }

                var blob = new Blob(
                    [array],
                    {type: 'application/pdf', encoding: 'raw'}
                );

                //Save generated pdf inside local file system
                saveAs(blob, "pdf_output");

                //Accessing the file system through cordova file plugin
                console.log("file system...");
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {

                        console.log(fileSystem.name);
                        console.log(fileSystem.root.name);
                        console.log(fileSystem.root.fullPath);


                        fileSystem.root.getFile("pdf_output.pdf", {create: true}, function (entry) {
                            var fileEntry = entry;
                            console.log(entry);

                            entry.createWriter(function (writer) {
                                writer.onwrite = function (evt) {
                                    console.log("write success");
                                };
                                console.log("writing to file");

                                //Writing the pdf
                                writer.write(blob);

                            }, function (error) {
                                console.log(error);
                            });

                        }, function (error) {
                            console.log(error);
                        });
                    },
                    function (event) {
                        console.log(evt.target.error.code);
                    });

                saveAs(blob, "filename");

            } catch (e) {
                console.log(e);
            }
            ;
        });

    }

}
