package ProjectUAS;
import java.util.Scanner;

public class NewClass {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        boolean statusLogin = false; //inisialisasi statsuLogin false
        int kesempatanLogin = 0; //inisialisasi kesempatanLogin bernilai deafault 0
        
        // Pisahkan kursi untuk dua film
        boolean[][] kursiFilm1 = new boolean[2][10]; // array 2 dimensi Kursi untuk Film 1, nilai default boolean false
        boolean[][] kursiFilm2 = new boolean[2][10]; // array 2 dimensi Kursi untuk Film 2, nilai default boolean false
        
        String[][] namaFilm = {{"1", "Harry Potter"},{"2", "Toy Story"}}; //array 2 dimensi tipe data String dengan nama variable namaFIlm, kolom 1 untuk id, kolom 2 untuk nama film
        int[][] hargaTiket = {{1, 50000},{2, 45000}}; //array 2 dimensi tipe data int dengan nama harga tiket, kolom 1 untuk id, kolom 2 untuk harga tiket
        String[][] users = {
            {"1", "Afrida Khoirun Nisa", "aprid.io", "123"},
            {"2", "Ahmad Maulana Abrori", "lanachan", "123"},
            {"3", "Ahmad Zidan Fariqi", "riqiKece", "123"},
            {"4", "Akhmad Nur Hidayat", "nrhidayat", "123"},
            {"5", "Bahrul Ulum", "Bahhhh", "123"},
            {"6", "Khalimatus Sakdiyah", "ImaSya", "123"},
            {"7", "Ipung Adikartika", "Ipungzz._", "123"}
        }; //array 2 dimensi tipe data string dengan nama user, kolom 1 untuk id, kolom 2 nama userlogin, kolom 3 username, kolom 4 untuk password
        
        System.out.println("===SELAMAT DATANG DI SISTEM TIKET BIOSKOP===");
        
        // Proses login
        while (kesempatanLogin < 3 && !statusLogin) { //perulangan while oprator &&
            System.out.println("\nSILAHKAN LOGIN TERLEBIH DAHULU!");
            System.out.print("Username: ");
            String username = input.nextLine(); //input username karyawan
            System.out.print("Password: ");
            String password = input.nextLine(); //input password karyawan

            // Cek username dan password
            for (int i = 0; i < users.length; i++) { //perulangan mengecek sebanyak variable users (7 data)
                if (users[i][2].equals(username) && users[i][3].equals(password)) { //pencocokan inputan username dan login pada database
                    statusLogin = true; ///merubah variable status login menjadi true
                    System.out.println("\nLogin berhasil!");
                    System.out.println("Selamat datang, " + users[i][1] + "!"); //menampilkan nama user login baris i array 1/kolom 2
                    break;
                }
            }

            if (statusLogin) { //cek apakah status login true, jika iya masuk ke pemilihan pertama
                boolean lanjutKeMenu = true; //inisialisasi lanjutKeMenu dengan status true

                // Menu utama setelah login
                while (lanjutKeMenu) { //cek variable lanjutKeMenu = true?
                    System.out.println("\nMenu Utama:");
                    System.out.println("1. Lihat Status Kursi");
                    System.out.println("2. Pesan Kursi");
                    System.out.println("3. Keluar");
                    System.out.print("Masukkan pilihan (1/2/3): ");
                    int menuPilihan = input.nextInt(); //inputan 3 pilihan menu
                    
                    switch (menuPilihan) { //pemilihan dari variable menuPilihan
                        case 1: //jika memilih 1 masuk ke case 1
                            // Tanyakan film yang ingin dilihat status kursinya
                            System.out.println("Pilih film yang ingin dilihat status kursinya:");
                            System.out.println("1. " + namaFilm[0][1]); //menampilkan variable namaFilm pada film baris 1
                            System.out.println("2. " + namaFilm[1][1]); //menampilkan variable namaFilm pada film baris 2
                            System.out.print("Masukkan pilihan (1/2): ");
                            int filmStatus; //inisialisasi variable filmStatus
                            //proses input pilihan film antara 1/2 selain itu tidak valid dan terus meminta input hinngga valid
                            while(true){ //perulangan terus menerus hingga pada line 68 status false dan keluar dari perulangan
                                filmStatus = input.nextInt(); //inputan film 1/2
                                if (filmStatus < 1 || filmStatus > 2) { // salah satu harus terpenuhi, antara 1 dan 2, jika true maka masuk pemilihan 1 jika false masuk pemilihan 2 dan break keluar dari perulangan
                                    System.out.println("Input Tidak Valid");
                                }else{
                                    break;
                                }
                            }
                            //proses pemilihan antara film 1/2
                            if (filmStatus == 1) { //pemilihan jika milih 1 true, selain 1 false masuk pemilihan 2
                                int sisaKursiFilm = cekKursi(kursiFilm1); //inisialisasi sisaKursi dengan memanggil fungsi cekKursi dengan parameter kursi film 1
                                //proses pemilihan cek apakah pada film masih ada kursi kosong atau tidak
                                if (sisaKursiFilm == 0) { 
                                   System.out.println("============================");
                                   System.out.println("Kursi pada film " + namaFilm[0][1] + " penuh!");
                                   System.out.print("============================");
                                }else{
                                    showSeats(kursiFilm1); //memanggil fungsi melihat status kursi
                                }
                            } else {
                                int sisaKursiFilm = cekKursi(kursiFilm2); //inisialisasi sisaKursi dengan memanggil fungsi cekKursi dengan parameter kursi film 2
                                //proses pemilihan cek apakah pada film masih ada kursi kosong atau tidak
                                if (sisaKursiFilm == 0) {
                                   System.out.println("============================");
                                   System.out.println("Kursi pada film " + namaFilm[1][1] + " penuh!");
                                   System.out.print("============================");
                                }else{
                                    showSeats(kursiFilm2); //memanggil fungsi melihat status kursi
                                }
                            }
                            break;
                        case 2: //jika memilih 2 masuk ke case 2
                            // Memilih film dan memesan kursi
                            boolean lanjutPesan = true; //inisialisasi lanjutPesan status true
                            //proses perulangan pemesanan tiket film 1/2
                            while (lanjutPesan) { //variable lanjutpesan = true maka perulangan / jika tidak maka akan ke break dan keluar dari case 2
                                System.out.println("Pilih film yang ingin Anda tonton:");
                                System.out.println("1. " + namaFilm[0][1]); //print film baris 1
                                System.out.println("2. " + namaFilm[1][1]); //print film baris 2
                                int filmPilihan; //inisialiasi filmPilian dari inputan line 109
                                while(true){ //perulangan terus menerus hingga line 110 status false masuk ke pemilihan 2 line 112 break keluar dari perulangan line 107 lanjut ke proses berikutnya line 120
                                    System.out.print("Masukkan pilihan (1/2): ");
                                    filmPilihan = input.nextInt(); //inputan film 1/2 dan disimpan ke variable filmPilihan line 106
                                    //proses pengecekan valid/tidak inputan
                                    if (filmPilihan < 1 || filmPilihan > 2) {
                                        System.out.println("Input Tidak valid, Masukan film 1/2");
                                    }else{
                                        break;
                                    }
                                }
                                
                                boolean[][] kursiPilih = null; //inisialisasi kursiPilih array 2 dimensi isian kosong / null untuk menyimpan array variable dari filmPilihan
                                String simpanNamaFilmDipilih = null; //inisialisasi simpanNamaFilmDipilih dari perubahan isi dari line 97/102
                                int simpanHarga = 0; //inisialisasi simpanHarga pada milih yang dipilih dengan nilai awal 0
                                //proses pemilihan filmketika inputan filmPilihan == 1 true maka masuk pemilihan 1, jika false masuk ke pemilihan 2 line 128
                                if (filmPilihan == 1) {
                                    kursiPilih = kursiFilm1; //menyimpan variable kursiFilm1 ke variable kursiPilih line 118
                                    simpanNamaFilmDipilih = namaFilm[0][1];// menyimpan namaFilm ke varibale simpanNamaFilmDipilih line 119
                                    simpanHarga = hargaTiket[0][1];// menyimpan hargaTiket ke varibale simpanHarga line 120
                                    
                                } else {
                                    kursiPilih = kursiFilm2; //menyimpan variable kursiFilm1 ke variable kursiPilih line 118
                                    simpanNamaFilmDipilih = namaFilm[1][1];// menyimpan namaFilm ke varibale simpanNamaFilmDipilih line 119
                                    simpanHarga = hargaTiket[1][1];// menyimpan hargaTiket ke varibale simpanHarga line 120
                                }
                                int sisaKursiFilm = cekKursi(kursiPilih);//inisialisasi sisaKursi dengan memanggil fungsi cekKursi dengan parameter kursiPilih
                                System.out.println("Kursi tersisa "+sisaKursiFilm +" dengan harga "+ simpanHarga); //menampilkan sisa kursi dan harga tiket pada film yang dipilih
                                //proses pengecekan pemesanan kursi < sisa kursi
                                if (sisaKursiFilm == 0) { //pemilihan jika sisaKursi = 0 (habis) maka masuk ke pemilihan 1, jika masih ada/selain 0 maka masuk pemilihan 2 line 140
                                    System.out.println("============================");
                                    System.out.println("Kursi pada film " + simpanNamaFilmDipilih + " penuh!"); //menampilkan pada film yang dipilih penuh
                                    System.out.print("============================");
                                    lanjutPesan = false; // merubah status false pada
                                }else{
                                    int jumlahTiket; //inisialisasi jumlah tiket yang akan dipesan
                                    //perulangan terus-menerus hingga jumlahTiket yang dipesan < sisaKursi dan keluar dari perulangan
                                    while(true){ 
                                        System.out.print("berapa tiket yang akan dipesan? "); // Menanyakan jumlah tiket yang ingin dipesan
                                        jumlahTiket = input.nextInt(); //input jumlah tiket
                                        if (jumlahTiket<=sisaKursiFilm) { //jika inputan jumlah tiket lebih kecil sama dengan sisaKursiFilm masuk ke pemilihan 1 dan break keluar dari perulangan, jika lebih besar dari sisa kursi maka masuk ke pemilihan 2 line 126
                                            break; //keluar dari perulangan terus-menerus
                                        }else{
                                            System.out.println("Kursi yang tersisa " + sisaKursiFilm + " untuk film " + simpanNamaFilmDipilih); //menampilkan sisa kursi untuk film yang dipilih
                                        }
                                    }
                                    // Proses pemesanan kursi
                                    int tiketSudahDipesan = 0; //inisialisasi tiket yang sudah dipesan/kursi yang sudah dipilih
                                    String[][] dataPesanan = new String[sisaKursiFilm][3]; //inisialisasi dataPesanan pelanggan maksimal banyaknya sisa kursi
                                    
                                    //proses perulangan memesan kursi sebanyak inputan jumlahTiket
                                    while (tiketSudahDipesan < jumlahTiket) {
                                        System.out.println("\nPilih kursi untuk tiket " + (tiketSudahDipesan + 1) + ":");
                                        showSeats(kursiPilih); // Tampilkan status kursi berdasarkan film yang dipilih
                                        int sisi; //inisialisasi sisi
                                        //proses perulangan tanpa batas hingga input valid 1 -2
                                        while (true) {
                                            System.out.print("Pilih sisi (1 untuk bawah, 2 untuk atas): ");
                                            sisi = input.nextInt(); //inputan sisi
                                            if (sisi < 1 || sisi > 2) { // jika sisi < 1 atau sisi > 2 maka masuk pemilihan 1, jika tidak maka masuk pemilihan 2
                                                System.out.println("Pilihan sisi tidak valid. Silakan coba lagi.");
                                            } else {
                                                break; // Keluar dari loop sisi jika valid (1/2)
                                            }
                                        }
                                        int nomorKursi; //inisialisasi nomerKursi
                                        //proses perulangan tanpa batas hingga input valid 1-10
                                        while (true) {
                                            System.out.print("Pilih nomor kursi (1-10): ");
                                            nomorKursi = input.nextInt(); //inputan nomerKursi
                                            if (nomorKursi < 1 || nomorKursi > 10) { // jika nomorKursi < 1 atau nomorKursi > 10 maka masuk pemilihan 1, jika tidak maka masuk pemilihan 2
                                                System.out.println("Nomor kursi tidak valid. Silakan coba lagi.");
                                            } else {
                                                break; // Keluar dari loop nomor kursi jika valid
                                            }
                                        }

                                        // Proses jika kursi kosong, pesan kursi tersebut
                                        if (!kursiPilih[sisi - 1][nomorKursi - 1]) { //pemilihan jika kursiPilih[sisi - 1][nomorKursi - 1] false, tapi ada oprator logika !(NOT) maka menjadi true, masuk pemilihan 1, jika true menjadi false masuk pemilihan 2
                                            kursiPilih[sisi - 1][nomorKursi - 1] = true; //merubah kursiPilih[sisi - 1][nomorKursi - 1] menjadi true
                                            dataPesanan[tiketSudahDipesan][0] = simpanNamaFilmDipilih; // Simpan nama film ke variable dataPesanan
                                            dataPesanan[tiketSudahDipesan][1] = sisi == 1 ? "Bawah" : "Atas"; // Simpan sisi ke variable dataPesanan
                                            dataPesanan[tiketSudahDipesan][2] = String.valueOf(nomorKursi); //simpan nomer convert dari int ke string menggunakan String.valueOf ke variable dataPesanan
                                            System.out.println("\nKursi " + (sisi == 1 ? "Kiri" : "Kanan") + " nomor " + nomorKursi + " berhasil dipesan!"); //print sisi yang dipilih dan nomer kursi yang dipilih berhasil dipesan
                                            tiketSudahDipesan++; //increment variable tiketSudahDipesan
                                        } else {
                                            System.out.println("\nKursi tersebut sudah terisi. Silakan pilih kursi lain."); //print kursi sudah terisi
                                        }
                                        System.out.println("\nSemua tiket berhasil dipesan!"); //print semua tiket sudah dipesan dari inputan
                                        totalPemesanan(dataPesanan, simpanHarga); //memanggil fungsi totalPemesanan dengan parameter variable dataPesanan dan variable simpanHarga
                                    }
                                    // Tanyakan apakah pengguna ingin memesan tiket untuk film lain
                                    System.out.println("\nApakah Pelanggan  ingin memesan tiket untuk film lain?");

                                    System.out.println("1. Iya");
                                    System.out.println("2. Tidak");
                                    

                                    int pilihan; //inisialisasi pilihan 
                                    //proses perulangan hingga inputan valid
                                    while(true){
                                        System.out.print("Masukkan pilihan (1/2): ");
                                        pilihan = input.nextInt();
                                        if (pilihan < 1 || pilihan > 2) {
                                            System.out.println("Inputan Tidak valid!");
                                        }else{
                                            break;
                                        }
                                    }
                                    //pemilihan switch case
                                    switch (pilihan) {
                                        case 1:
                                            lanjutPesan = true; // Lanjutkan memesan film lain 
                                        break;
                                        case 2:
                                            lanjutPesan = false; // merubah status lanjutPesanan menjadi false dan Keluar dari loop pemesanan
                                        break;
                                    }
                                }
                            }
                        break;
                        case 3: //jika memilih 3 masuk ke case 3
                            System.out.println("Terima kasih! Sampai jumpa.");
                            lanjutKeMenu = false; // Keluar dari menu utama dan log out dengan merubah variable lanjutKeMenu menjadi falkse
                            break;
                        default:
                            System.out.println("Pilihan tidak valid. Silakan coba lagi.");
                    }
                }

            } else {
                kesempatanLogin++; //increment kesempatanLogin
                System.out.println("\nUsername atau password salah. Percobaan " + kesempatanLogin + " dari 3.");
            }
        }
    }

    // Menampilkan status kursi
    public static void showSeats(boolean[][] kursi) { //fungsi showSeats parameter tipe data boolean array 2d kursi
        System.out.println("\nStatus Kursi:");
        System.out.println("==========================================================================");
        System.out.println("==============================LAYAR BIOSKOP===============================");
        System.out.println("==========================================================================");
        for (int i = 0; i < 2; i++) { //perulangan hingga 2x
            String sisi;
            
            // Menentukan sisi kiri atau kanan dengan if-else
            if (i == 0) {
                sisi = "Bawah";
            } else {
                sisi = "Atas";
            }
            
            System.out.println(sisi + ": ");
            // Menampilkan kursi per nomor
            for (int j = 0; j < kursi[0].length; j++) {
                // Menampilkan status kursi, jika sudah terisi akan menampilkan 'X', jika kosong akan menampilkan nomor kursi
                if (kursi[i][j]) {
                    System.out.print("X\t"); // Kursi sudah terisi
                } else {
                    System.out.print((j + 1) + "\t"); // Kursi kosong, menampilkan nomor kursi
                }
            }
            System.out.println(); // Pindah baris setelah satu sisi selesai
        }
    }
 public static void totalPemesanan(String[][] dataPesanan, int hargaFilm){ //fungsi totalPemesanan parameter string array 2 dataPesanan dan parameter int hargaFilm
        int totalPrice = 0; //inisialisasi totalHargaTiket
        System.out.println("\n===RINCIAN PEMESANAN===");

        // Menampilkan detail pemesanan dan menghitung total harga
        for (int i = 0; i < dataPesanan.length; i++) { //perulangan sebanyak baris variable dataPesanan
            if (dataPesanan[i][0] != null) { // Pastikan dataPesanan[i][0] berisi data
                System.out.println("Film: " + dataPesanan[i][0] + ", Sisi: " + dataPesanan[i][1] + ", Nomor Kursi: " + dataPesanan[i][2]);
                totalPrice += hargaFilm; // Tambahkan harga tiket dan disimpan ke variable totalPrice
            }
        }

        // Menampilkan total harga
        System.out.println("\nTotal Harga: " + totalPrice + " IDR"); //menampilkan total harga tiket
    }
 public static int cekKursi(boolean[][] kursiPilih){
     int sisaKursiFilm = 0; //inisialisasi untuk menyimpan sisaKursi pada film yang dipilih
     for (int i = 0; i < kursiPilih.length; i++) { //perulangan banyak baris/sisi
        for (int j = 0; j < kursiPilih[0].length; j++) { //perulangan banyak kursi di setiap baris/sisi
            if (!kursiPilih[i][j]) { //cek pada variable kursiPilih apakah status false dan diubah menjadi true dengan oprator Logika ! (NOT), jika false => true masuk pemilihan
                sisaKursiFilm++; //increment variable sisaKursiFilm
            }
        }
    }
     return sisaKursiFilm; //mengembalikan nilai pada variable sisaKursi Film ke line yang memanggil fungsi cekKursi
 }
}