# DICOMToFHIRImagingStudy
HTML5 App to create a [FHIR Imaging Study](http://www.hl7.org/implement/standards/fhir/imagingstudy.html)
resource from a DICOMweb Study (via WADO-RS Retrieve Metadata)

[Click here to run this application in your web browser](http://chafey.github.io/DICOMToFHIRImagingStudy/)

Building
========

[Node.js](www.nodejs.org)

grunt-cli
> npm install -g grunt-cli

bower
> npm install -g bower

Install NPM Dependencies
> npm install

Install Bower Dependencies
> bower install

Run the build
> grunt --force

The build output will be placed in ../DICOMToFHIRImagingStudyBuild.

You can also run grunt in watch mode so it will automatically rebuild the output when anything changes

> grunt watch

Backlog
=======

* Flag to only store required fields (not optional ones)
* Flag to only generate instances that are referenced in KO, PR and SR instances
* Ability to PUT/POST the resoure to a FHIR server?
* Allow selection of study via QIDO-RS query?
* Support creation via QIDO-RS query
* Support creation via parsing DICOM P10 files (on disk, wado-uri or wado-rs)


Copyright
============
Copyright 2015 Chris Hafey [chafey@gmail.com](mailto:chafey@gmail.com)