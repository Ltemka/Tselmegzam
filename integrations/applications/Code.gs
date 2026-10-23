/**
 * Цэлмэг Зам ХХК - Public job application receiver
 * Google Sheet: Хүний нөөц анкет - Цэлмэг зам ERP
 * Deploy as Web App, execute as owner, access Anyone.
 * Keep the Google Sheet itself PRIVATE (HR editors only).
 */
const SHEET_ID = '1R3DIYsHHUw9EMtfw8UfcN7HOMAyeuzuX_05xIR7vqc8';
function response(title, message) {
  return HtmlService.createHtmlOutput('<!doctype html><html lang="mn"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><body style="font:16px Segoe UI,Arial;padding:40px;max-width:620px;margin:auto"><h1>'+title+'</h1><p>'+message+'</p><a href="https://tselmegzam.mn/apply/">Анкетын хуудас руу буцах</a></body></html>');
}
function doPost(e) {
  try {
    const p=e&&e.parameter||{};
    if(p.website) return response('Хүсэлт хүлээн авлаа','Баярлалаа.');
    const get=(key,max=1500)=>String(p[key]||'').trim().slice(0,max);
    if(p.consent!=='yes'||!get('surname',80)||!get('givenName',80)||!get('phone',24)||!get('position',100))
      return response('Анкет дутуу байна','Заавал бөглөх хэсгүүдээ шалгана уу.');
    const email=get('email',120);
    if(email&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return response('Имэйл буруу байна','Имэйл хаягаа шалгана уу.');
    const experience=get('experience',3);
    if(experience&&(!/^\\d{1,2}$/.test(experience)||Number(experience)>60))
      return response('Туршлага буруу байна','Ажилласан жил 0–60 байх ёстой.');
    const safe=v=>{v=String(v||'');return /^[=+@\\-\\t\\r]/.test(v)?"'"+v:v;};
    const lock=LockService.getScriptLock();lock.waitLock(10000);
    try{
      const sh=SpreadsheetApp.openById(SHEET_ID).getSheetByName('Sheet1');
      if(!sh)throw new Error('Sheet1 missing');
      const id=Utilities.getUuid();
      const row=[id,new Date(),get('surname',80),get('givenName',80),get('phone',24),email,
        get('city',100),get('project',160),get('position',100),get('education',120),
        experience,get('startDate',10),get('fieldReady',30),get('license',60),
        get('workHistory'),get('skills'),'Шинэ'].map(safe);
      sh.appendRow(row);
      return response('Анкет амжилттай илгээгдлээ','Таны анкет бүртгэгдлээ. Сонгон шалгаруулалтын явцад шаардлагатай бол холбогдох болно.');
    }finally{lock.releaseLock();}
  }catch(err){
    console.error(err);
    return response('Анкет илгээгдсэн эсэх тодорхойгүй','Алдаа гарлаа. Дахин илгээхийн өмнө хүний нөөцийн ажилтнаас бүртгэл орсон эсэхийг лавлана уу.');
  }
}