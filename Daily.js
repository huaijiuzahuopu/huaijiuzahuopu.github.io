class SalesInfo{
    date
    today_target
    tomorrow_target
    amount
    tea
    today_ach
    weekly_target
    weekly_total
    weekly_ach
    monthly_target
    monthly_total
    monthly_ach
    list = ["日期","今日目标","今日达成率"
    ,"明日目标","周目标","周完成","周达成率"
    ,"本月目标","本月累计完成","本月达标率"
    ,"今日合计","花茶月累计","客单量"]
    constructor(daily){
        for(let i = 0; i < daily.length;i++){
            for(let j in this.list){
                let text = daily[i];
                let key = this.list[j];
                if(daily[i].includes(this.list[j])){
                    this.excuse(text,key);
                }
            }
        }
    }
    excuse(text,key){
        if(!(text.includes(":") || text.includes("："))){
            return ;
        }
        let flag = text.includes(":") ? ":" : "：";
        let text_key = text.split(flag)[0].trim();
        if(text_key.length != key.length){
            return ;
        }
        switch(key){
            case "日期":
                this.date = this.get_value(text); break;
            case "今日目标":
                this.today_target = parseFloat(this.get_value(text)); break;
            case "今日达成率":
                this.today_ach = this.get_value(text); break;
            case "明日目标":
                this.tomorrow_target = parseFloat(this.get_value(text)); break;
            case "周目标":
                this.weekly_target = parseFloat(this.get_value(text)); break;
            case "周完成":
                this.weekly_total = parseFloat(this.get_value(text)); break;
            case "周达成率":
                this.weekly_ach = this.get_value(text); break;
            case "本月目标":
                this.monthly_target = parseFloat(this.get_value(text)); break;
            case "本月累计完成":
                this.monthly_total = parseFloat(this.get_value(text)); break;
            case "本月达标率":
                this.monthly_ach = this.get_value(text); break;
            case "今日合计":
                this.tea = this.get_value(text); break;
            case "客单量":
                console.log("aa");
                this.amount = this.get_value(text); break;

        }
    }
    get_value(text){
        let flag = text.includes(":") ? ":" : "：";
        return text.split(flag)[1];
    }
}
class Daily{
    amount
    tea
    daily
    info
    constructor(tea,amount,daily){
        this.amount = amount
        this.tea = tea
        this.daily = daily
        this.init()
        //this.handel_sales();
    }
    init(){
        this.daily = this.daily.split('\n');
        for(let index in this.daily){
            let text = this.daily[index];
            this.daily[index] = text.trim();
        }
        this.info = new SalesInfo(this.daily)
        this.handel_sales()
    }
    handel_sales(){
        if(this.isWeek()){
            this.set_value("周完成",0);
        }
        const current_day = new Date().getDay();
        this.set_value("日期",this.get_date());
        this.set_value("今日目标",1500);
        this.set_value("明日目标",1500)
        if(current_day == 6 || current_day == 0){
            this.set_value("今日目标",2000);
        }else if(current_day + 1 == 6,current_day + 1 == 0){
            this.set_value("明日目标",2000)
        }
        this.set_value("今日合计",this.tea);
        this.set_value("客单量",this.amount)
        this.set_value("今日达成率",this.format(this.tea / this.info.today_target)+"%")
        this.set_value("周完成",parseFloat(this.info.weekly_total) +parseFloat(this.tea));
        this.set_value("周达成率",this.format(this.info.weekly_total/this.info.weekly_target)+"%")
        this.set_value("本月累计完成",parseFloat(this.info.monthly_total) +parseFloat(this.tea));
        this.set_value("本月达标率",this.format(this.info.monthly_total/this.info.monthly_target)+"%")
    }

    set_value(key,value){
        for(let i = 0; i < this.daily.length; i++){
            let text = this.daily[i];
            let flag = text.includes(":") ? ":" :"：";
            let temp_key = text.split(flag)[0].trim();
            if(temp_key == key){
                this.daily[i] = text.split(flag)[0] + flag + value;
                this.info = new SalesInfo(this.daily);
                break;
            }
        }
    }
    isMonth(){
        return new Date().getDate() === 1;
    }
    isWeek(){
        return new Date().getDay() === 1;
    }
    get_result(){
        return this.daily.join("\n")
    }
    get_date(){
        const hours = new Date().getHours();
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        function get_last_month(month_temp){
            if(month_temp == 1){
                return 12
            }else{
                return month_temp - 1;
            }
        }
        
        if(hours >= 0 && hours <=6){
            if(day == 1){
                if(month == 1){
                    month = get_last_month();
                    day = this.getTotalDaysInMonth(currentDate.getFullYear - 1,month);
                }else{
                    month = get_last_month();
                    day = this.getTotalDaysInMonth(currentDate.getFullYear,month);
                }
                
            }
            day = day - 1;
        }
        return `${month}/${day}`;
    }
    get_days(){
        const hours = new Date().getHours();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        
        const currentYear = currentDate.getFullYear();
        const totalDaysInMonth = this.getTotalDaysInMonth(currentYear, currentMonth);
        if(hours >= 0 && hours <=6){
            currentDay = currentDay - 1;
        }
        const result = totalDaysInMonth - currentDay;
        return result === 0 ? 1 : result;
    }
    getTotalDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    format(value){
        const intValue = Math.trunc(value * 100);
        const decimalPart = Math.floor((value * 100) % 1 * 100);
        const result = `${intValue}.${decimalPart.toString().padStart(2, '0')}`;
        return result;
    }
    format_a(value){
        const intValue = Math.trunc(value);
        const decimalPart = Math.floor(value % 1 * 100);
        const result = `${intValue}.${decimalPart.toString().padStart(2, '0')}`;
        return result;
    }

}
//ajahbsshhsjshdbdhdjsjsj
//ajahbsshhsjshdbdhdjsjsj
//ajahbsshhsjshdbdhdjsjsj
//ajahbsshhsjshdbdhdjsjsj
//ajahbsshhsjshdbdhdjsjsj
