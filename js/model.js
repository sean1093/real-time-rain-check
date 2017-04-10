


var getAjaxData = function(callback){
    console.log("getAjaxData");
    var url = "http://opendata.epa.gov.tw/ws/Data/RainTenMin/?$format=json&callback=?";

    setTimeout(function () { 
        jQuery.ajax({                   
            url: url,
            dataType: 'json',
            success: function(response) {
                callback(response);
                $.unblockUI();

            },
            error: function(){
                alert('Fail to get real-time rain data<br>Plaese wait or check your Internet connection');
                 $.unblockUI();
             }
        }); 
    },100);

    // for test
    // var data = [{"SiteId":"C1R330","SiteName":"枋山","County":"屏東縣","Township":"枋山鄉","TWD67Lon":"120.6531","TWD67Lat":"22.2486","Rainfall10min":"0","Rainfall1hr":"0","Rainfall3hr":"0","Rainfall6hr":"15.5","Rainfall12hr":"15.5","Rainfall24hr":"20.5","Now":"5","Unit":"局屬無人測站","PublishTime":"2016-10-07 04:40:00"},{"SiteId":"81U890","SiteName":"大里國小","County":"宜蘭縣","Township":"頭城鎮","TWD67Lon":"121.9179","TWD67Lat":"24.9721","Rainfall10min":"0","Rainfall1hr":"0","Rainfall3hr":"0.5","Rainfall6hr":"2.5","Rainfall12hr":"3","Rainfall24hr":"6","Now":"3","Unit":"農委會水土保持局","PublishTime":"2016-12-15 21:20:00"},{"SiteId":"81R660","SiteName":"內獅國小","County":"屏東縣","Township":"獅子鄉","TWD67Lon":"120.6367","TWD67Lat":"22.3068","Rainfall10min":"0","Rainfall1hr":"0","Rainfall3hr":"0.5","Rainfall6hr":"7","Rainfall12hr":"7","Rainfall24hr":"7","Now":"7","Unit":"農委會水土保持局","PublishTime":"2016-12-15 21:20:00"},{"SiteId":"81V830","SiteName":"那瑪夏國","County":"高雄市","Township":"那瑪夏區","TWD67Lon":"120.6886","TWD67Lat":"23.2422","Rainfall10min":"0","Rainfall1hr":"0","Rainfall3hr":"0","Rainfall6hr":"0","Rainfall12hr":"0","Rainfall24hr":"0","Now":"0","Unit":"農委會水土保持局","PublishTime":"2016-12-15 21:20:00"}];
    // changeView(data);
    // $.unblockUI();
};


