# Dataviz project - UNECA Country Profile 2016

Project date: Feb 2017

Live version: https://ecastats.uneca.org/cp2016/

# Main components
## 1. Html
 - CP 2016.html
 - CP 2016 FR.html: French version
## 2. Javascript for graphs (d3)
The javascript file contains following functions which takes a country selected by a user and generates a chart/graph
- html: take a country and generate all graphs for the country using functions below
 - map: take a country and generate a map 
 - gdp: take a country and generate a line chart for GDP
 - cab: take a country and generate a stacked bar chart overlaid with line chart for current account balance 
 - arii: take a country and generate a bar chart for Africa Regional Integration Index
 - trade: take a country and generate pie charts for trade data
 - population: take a country and generate stacked bar chart for demography data
 - health: take a country and other design indicators and generate bar charts for mortality data
 - gender: take a country and generate Africa Gender Scorecard
## 3. Data files
 - data.json
 - Africa_Low.json: geoJson for Africa map (low resolution ver.)
 - DesignSpecification.json
## 4. Css style file
## 5. Png image files for icons
