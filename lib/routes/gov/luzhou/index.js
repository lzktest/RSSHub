const got = require('@/utils/got');
const cheerio = require('cheerio');
const logger = require('@/utils/logger');
module.exports = async (ctx) => {
    const modules  = ctx.params.modules;
    let url = '';
    let title ='';
    switch(modules){
	case 'fazgh':
	    url =`http://www.luzhou.gov.cn/zw/fazgh`;
	    title ='泸州发展规划';
	    break;
	case 'tjxx':
	    url =`http://www.luzhou.gov.cn/zw/tjxx`;
	    title ='泸州统计信息';
	    break;
	case 'zdgz':
	    url =`http://www.luzhou.gov.cn/zw/zdgz`;
	    title ='泸州重点工作';
	    break;
	default:
	logger.error('pattern not matched');
    }
    const response = await got({
        method: 'get',
        url,
    });
    
    const data = response.data;

    const $ = cheerio.load(data);
    $('.split').remove();
    const list = $('.mBd li');
    let itemPicUrl;
    
    ctx.state.data = {
        title,
        link: url,
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    itemPicUrl = `${item.find('li a').attr('href')}`;
                    return {
                        title: item.find('li a').attr('title'),
                        description: `描述：${item.find('li a').text()}`,
                        link: item.find('li a').attr('href'),
			pubDate: `new Date().toUTCString()`,
			guid: item.find('li span').text()+item.find('li a').text(),
                    };
                })
                .get(),
    };
};
