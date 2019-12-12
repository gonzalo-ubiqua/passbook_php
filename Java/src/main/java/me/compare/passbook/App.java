package me.compare.passbook;

import java.io.File;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;

// import de.brendamour.jpasskit.PKPass;
import de.brendamour.jpasskit.PKPass;
// import PassBook;

public class App 
{
    public static void main( String[] args )
    {
        try {
        	
	        PassBook NewPB = new PassBook();
	        // 	Datos genéricos de passbook
	        // Sólo hay que llamar a este método si los templetates se cambian
	        //     del sitio estándar: (.)
//	        NewPB.setWorkingFolder("/home/gonzalo/dev/Projects/Passbooks/app");
	        NewPB.setTemplateFolder("CortijoFontanilla.pass");
	        NewPB.setClientCertName("pass.cortijo.fontanilla.me.123compare.p12");
	        // 	Debe ser el mismo con el que ha generado el certificado de apple
	        NewPB.setClientSignDomain("pass.cortijo.fontanilla.me.123Compare");
	        NewPB.setPassDescription("Cortijo Fontanilla");
	        NewPB.setLogoText("");
	        

	        
	        // Datos específicos de passbook
//	        String book_id = "0000001";
//	        NewPB.setBarcodeData(book_id);
//            NewPB.addPrimaryField("Name", "Joaquin von Knobloch", "l");
//            NewPB.addSecondaryField("Member #", book_id, "l");
////            NewPB.addPrimaryField("Import", 1500, "EUR", "r");

	        String book_id = args[0]; // "0000002";
	        String name    = args[1];
	        NewPB.setBarcodeData(book_id);
            NewPB.addPrimaryField("Name", name, "l");
            NewPB.addSecondaryField("Member #", book_id, "l");
//            NewPB.addPrimaryField("Import", 1500, "EUR", "r");

            
            
            try {
                System.out.println( "passbook => firmar y generar" );
    			PKPass generatedPB = NewPB.finish(book_id + "-" + App.getDateToday());
    		} catch (Exception e) {
    			throw new Exception("Error generando el passbok: " + e.getMessage());
    		}
            
        } catch (Exception e) {

        	e.printStackTrace();
		
        }
        
    }
    
    public static String getDateToday() {
        SimpleDateFormat dnt = new SimpleDateFormat("yyMMdd");
        Date date			 = new Date();
        
        return dnt.format(date);

    } 
    
    public static void prueba()  {

    	URL url = App.class.getResource("./clients");
    	File folder = new File(url.getPath());
    	System.out.println(folder.getAbsolutePath());
    	listFilesForFolder(folder);
    	
    }
    
    public static void listFilesForFolder(final File folder) {
    	System.out.println("Tratando la carpeta " + folder.getName());
    	
        for (final File fileEntry : folder.listFiles()) {
            if (fileEntry.isDirectory()) {
                listFilesForFolder(fileEntry);
            } else {
                System.out.println(fileEntry.getName());
            }
        }
    }
}
