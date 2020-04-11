const got = require('@/utils/got');
const cheerio = require('cheerio');
const logger = require('@/utils/logger');
module.exports = async (ctx) => {
    const modules  = ctx.params.modules;
    logger.error('aaa',modules);
    let url = '';
    let title ='';
    switch(modules){
	case 'fzgh':
	    url =`http://www.luzhou.gov.cn/zw/fazgh`;
	    title ='泸州发展规划';
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
        title: '泸州统计信息',
        link: 'http://www.luzhou.gov.cn/zw/tjxx',
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
    logger.error('------',ctx.state.data);
};
