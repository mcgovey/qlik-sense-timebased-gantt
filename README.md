# D3 Gantt Chart Extension
Qlik Sense extension for time-based gantt charts using D3

## A Brief Note
This project is in version 0.1.  There is still a reasonable amount of work needed before this is stable.  Please submit an issue if you find something that isn't working as expected or better yet, create a pull request.

## Project Description

This extension allows the user to create a bullet chart in Qlik Sense (using the D3.js library) that allows the user to visualize up to three measures across one or no dimensions.  The linear gauge chart in Qlik Sense only allows for a maximum of two dimensions and does not allow the user to create a bar for each dimension.  This project intends to provide the user with a much more extensive ;) charting option.


## Installation Instructions
### Desktop
To use this extension, unzip the folder from [here](https://github.com/mcgovey/qlik-sense-timebased-gantt/blob/master/dist/sense-d3-gantt.zip) into the directory C:\Users\%USERNAME%\Documents\Qlik\Sense\Extensions.  Launch Qlik Sense and open an app, edit the app, and drag the 'sense-d3-gantt' Chart Object onto the sheet where you'd like it to appear. 

## Configuration Options
### Basic Configuration
| Configuration | Description   | Required  |
| ------------- |---------------| -----|
| Dimension 1      | First dimension should be unique identifier of each bar  | Yes |
| Dimension 2      | Date based dimension, for start position of bars (must check start date box)      |   Yes |
| Measure 1 | Duration of gantt      |    Yes |

### Color configuration
Within the measure configuration there are options to style bars, will be outlined later

## Screenshots
# Missing

## Sample Application
Grab a sample QVF [here](https://github.com/mcgovey/qlik-sense-timebased-gantt/tree/master/examples)

## Author

**Kevin McGovern**

* [github.com/mcgovey](http://github.com/mcgovey)
* [twitter.com/mcgovey](http://twitter.com/mcgovey)

## Contributions, Comments, Feedback & Questions

If you would like to contribute, have any questions, found any bugs, etc., please [create an issue on GitHub](https://github.com/mcgovey/qlik-sense-timebased-gantt/issues).

## Resources Used in this Extension
* [senseD3utils](https://github.com/brianwmunz/QlikSenseD3Utils)
* [D3.js](https://d3js.org/)
* [moment.js](https://momentjs.com/)
* [jQuery](https://jquery.com/)

# License
This extension is provided 'as is' under the MIT License.

[Additional license information for this extension](https://github.com/McGovey/qlik-sense-timebased-gantt/blob/master/LICENSE.md).
