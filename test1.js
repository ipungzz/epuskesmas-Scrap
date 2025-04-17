const schedule = require('node-schedule');

// Contoh: Menjalankan tugas setiap hari pada pukul 10:30
const job = schedule.scheduleJob('18 * * * *', function(){
    console.log('Program dijalankan pada jam 10:30!');
});

// Contoh lain: Menjalankan tugas pada jam tertentu (misal: 14:00, 18:00, dan 22:00)
const times = ['00 14 * * *', '00 18 * * *', '00 22 * * *'];

times.forEach(time => {
    schedule.scheduleJob(time, function(){
        console.log(`Program dijalankan pada waktu: ${time}`);
    });
});

console.log('Penjadwalan program telah dimulai...');