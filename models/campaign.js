var mongoose = require('mongoose');

var campaignSchema = mongoose.Schema({
    campaign_name: String,
    desc_campaign: String,
    start_date: Date,
    end_date: Date,
    campaign_image : String
    
    
    
    
});

module.exports = mongoose.model('Campaign',campaignSchema);