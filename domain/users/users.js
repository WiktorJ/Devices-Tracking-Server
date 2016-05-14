/**
 * Created by wiktor on 14/05/16.
 */
var path = require('path');
var dbUtils = require(path.join(__base, 'persistence/mongoUtils'));
dbUtils.getDb();