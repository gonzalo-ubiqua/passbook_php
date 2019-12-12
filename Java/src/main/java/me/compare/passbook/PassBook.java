/*
 *      PassBook.init(barCodeInfo);
 *      PassBook.addPrimaryField(name, value, Optional Currency);
 *      
 *      PKpass generate_passbook = PassBook.finish();
 *      
 */
package me.compare.passbook;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.lang.reflect.Constructor;
import java.net.URL;
import java.nio.charset.Charset;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.io.IOUtils;
import de.brendamour.jpasskit.PKBarcode;
import de.brendamour.jpasskit.PKField;
import de.brendamour.jpasskit.PKLocation;
import de.brendamour.jpasskit.PKPass;
import de.brendamour.jpasskit.enums.PKBarcodeFormat;
import de.brendamour.jpasskit.enums.PKTextAlignment;
import de.brendamour.jpasskit.passes.PKGenericPass;
// import de/brendamour/jpasskit/signing/IPKPassTemplate;
import de.brendamour.jpasskit.signing.PKInMemorySigningUtil;
import de.brendamour.jpasskit.signing.PKPassTemplateInMemory;
import de.brendamour.jpasskit.signing.PKSigningInformation;
import de.brendamour.jpasskit.signing.PKSigningInformationUtil;
import de.brendamour.jpasskit.signing.PKSigningUtil;
// import passBook.App;

public class PassBook {
	
	// Author: Gonzalo García
	// Date: 08/11/2019
	// Current revision: 1
	// Last modified: 
	// By: 
	// Reviewers:
	
	PKPass pass 		   = new PKPass();
	PKGenericPass passType = new PKGenericPass();

	protected final String default_template_folder_name = "Generic.pass";
	protected final String templates_folder				= "Templates";
	protected final String certificates_folder			= "Certs";
	protected final String out_folder	                = "pkpass_generated";

	// Ubiqua config ( mustn't be modified )
	private final String appleWWDRCA		 = "AppleWWDRCA.cer";
	private final String privateKey			 = "20Ubiq2018";
	private final String organization_name	 = "Ubiqua Instant Response S.L.";
	private final String ubiqua_team_id		 = "SKYJ3N6G25";
	
	// Mandatory fields	( fields to fill for each ubiqua's client )
	private String working_folder_name  = "."; 
	private String privateKeyPath		= "";
	private String sign_domain			= ""; // Debe ser el mismo con el que ha generado el certificado de apple
	private String current_template_folder_name = "";

	// Signing info
//	private String privateKeyPath		= "appleCerts/pass.cortijo.fontanilla.me.123compare.p12";
	// Debe ser el mismo con el que ha generado el certificado de apple
//	private String sign_domain			= "passbook.cortijo.me.123Compare";
//	private String sign_domain			= "pass.cortijo.fontanilla.me.123Compare";
	
//	private String pass_description		= "Book Cortijo";
//	private String logo_text			= "Cortijo Fontanilla";

	// Template data
//	protected String current_template_folder_name = "";
	
//	private IPKPassTemplate pass_folder;
	
	// Field that must be different for each passbook
	private ArrayList<PKField> primary_fields   = new ArrayList<PKField>();
	private ArrayList<PKField> secondary_fields = new ArrayList<PKField>();
	private ArrayList<PKLocation> locations		= new ArrayList<PKLocation>();
	private int num_serie = 1;

	private String out_folder_name              = "pkpass_generated";
	
	// ------------------------------------------------------------------------
	public PassBook() {
//		this.prueba();

		this.init();
	}
	// ------------------------------------------------------------------------
	//
	// @param barCodeInfo string => Data that will be record in the barcode
	//
	public void init() {
		primary_fields.clear();
		secondary_fields.clear();
		locations.clear();

		pass = new PKPass();
		pass.setFormatVersion( 1 );
//		this.setSignData();
		
//        pass.setLogoText(logo_text);
//		pass.setDescription( pass_description );
//		pass.setBackgroundColorAsObject( Color.BLACK );
		pass.setBackgroundColor( "#363e6d" );
		pass.setForegroundColor( "#FFFFFF" );
		pass.setLabelColor( "#FFD800" );
		
    	URL url = getClass().getResource(working_folder_name);
//    	File folder = new File(url.getPath());
    	
//    	System.out.println("url working_folder_name: " + url.getPath());
    	File folder = new File(working_folder_name);

    	working_folder_name = folder.getAbsolutePath();

	}

	// ------------------------------------------------------------------------
	//
	// @param pkpass_file_name string => Name of the pkpass
	// @return PKPass Object
	//
	public PKPass finish(String pkpass_file_name) throws Exception {
		
		if ( primary_fields.size() > 0 )	passType.setPrimaryFields(primary_fields);
		if ( secondary_fields.size() > 0 )	passType.setSecondaryFields(secondary_fields);
		if ( locations.size() > 0 )			pass.setLocations(locations);
		pass.setGeneric(passType);
		
		if (passType.isValid()) {
	    	System.out.println("working_folder_name " + working_folder_name);
	    	System.out.println("certificates_folder " + working_folder_name + "/" + certificates_folder);

			PKPassTemplateInMemory passTemplateFolderInM = new PKPassTemplateInMemory();
			passTemplateFolderInM.addAllFiles(working_folder_name + "/" + templates_folder + "/" + current_template_folder_name);

			PKSigningInformationUtil signingInformationUtil = new PKSigningInformationUtil();
			PKSigningInformation passSigningInformation = signingInformationUtil.loadSigningInformation(
					working_folder_name + "/" + certificates_folder + "/" + privateKeyPath, 
					privateKey, 
					working_folder_name + "/" + certificates_folder + "/" + appleWWDRCA
			);
			
//			PKSigningInformation pp = PKSigningUtil.loadSigningInformationFromPKCS12AndIntermediateCertificateStreams(
//						pkcs12KeyStoreInputStream, 
//						keyStorePassword, 
//						appleWWDRCAFileInputStream
//					);

            PKInMemorySigningUtil inMemorySigningUtil = new PKInMemorySigningUtil();
            byte[] passZipAsByteArray = inMemorySigningUtil.createSignedAndZippedPkPassArchive(pass, passTemplateFolderInM, passSigningInformation);
		
            String outputFile = working_folder_name + "/" + out_folder  + "/" + out_folder_name + "/" + pkpass_file_name + ".pkpass"; // change the name of the pass
            ByteArrayInputStream inputStream = new ByteArrayInputStream(passZipAsByteArray);
            IOUtils.copy(inputStream, new FileOutputStream(outputFile));
            System.out.println("Done!");

		} else {
        
			List<String> error_list = passType.getValidationErrors();
    		for (int i = 0; i < error_list.size(); i++) {
    			System.out.println(error_list.get(i));
    		}
    		throw new Exception("the pass is NOT Valid man!!!");

		}
		
		return pass;
	
	}
	
	// ========================================================================
	//     P A S S B O O K   C O N F I G
	// ========================================================================
	// ------------------------------------------------------------------------------
	public void setWorkingFolder(String folder_name) throws Exception {
		
		if ( ! folder_name.isEmpty() ) { 
			if ( PassBook.fileExists(folder_name) && PassBook.isFolder(folder_name)  ) {
		    	URL url = getClass().getResource(working_folder_name);
		    	File folder = new File(url.getPath());
		    	working_folder_name = folder.getAbsolutePath();
			} else {
				throw new Exception(folder_name + " don't exists or isn't a folder");		
			}
		} else {
			throw new Exception("Working folder name can't be empty");
		}
	}
	
	// ------------------------------------------------------------------------
	public void setClientCertName(String client_cert_name_p12) {

		privateKeyPath = client_cert_name_p12;
	
	}
	
	// ------------------------------------------------------------------------
	public void setClientSignDomain(String client_sign_domain) {

		sign_domain = client_sign_domain;
		this.setSignData();
	
	}
	
	// ------------------------------------------------------------------------------
	public void setTemplateFolder(String folder_name) throws Exception {
		
		String validation_folder = working_folder_name + "/" + templates_folder + "/" + folder_name;
//		String validation_folder = working_folder_name + "/" + templates_folder;
//		System.out.println(validation_folder);

		if ( PassBook.fileExists(validation_folder) && PassBook.isFolder(validation_folder)  ) {
//		if ( PassBook.fileExists(validation_folder) ) {
		
			current_template_folder_name = folder_name;
			out_folder_name = folder_name;
			createOutputFolder();

		} else {
		
			throw new Exception(validation_folder + " don't exists in working folder or isn't a folder");		
		
		}
		
	}
	
	// ------------------------------------------------------------------------------
	public void setTemplateFolder() {
		
		this.current_template_folder_name = default_template_folder_name;
		
	}
			
	// ---------------------------------------------------------------------------
	public void setPassDescription(String description) {
		
		pass.setDescription( description );
		
	}

	// ---------------------------------------------------------------------------
	public void setLogoText(String description) {
		
		pass.setLogoText(description);
	}
	


	// ========================================================================
	//     U S E R   C O N F I G     (user who must receive the passbook)
	// ========================================================================
	//     P R I M A R Y   F I E L D S
	// ========================================================================
	// ------------------------------------------------------------------------
	//
	// @param name string => Name of the field
	// @param value string => value of the field
	// @param align string => alignment of the field (must be c, l, n or r)
	//
 	public void addPrimaryField(String name, String value, String align ) {
		PKField field = new PKField();

		field.setKey(name);
		field.setLabel( name );
		field.setValue(value);
		field.setTextAlignment( setFieldAlign(align) );

		this.primary_fields.add(field);

	}
	
	// ------------------------------------------------------------------------
	// For add a price 
	// @param name string => Name of the field
	// @param value Double => value of the field
	// @param value String => code of the currency
	// @param align string => alignment of the field (must be c, l, n or r)
	//
	public void addPrimaryField(String name, Double value, String currency_code, String align) {
		PKField field = new PKField();

		field.setKey(name);
		field.setLabel( name );
		field.setValue(value); 
		field.setCurrencyCode(currency_code);
		field.setTextAlignment( setFieldAlign(align) );
        
		this.primary_fields.add(field);
		
	}
	
	// ------------------------------------------------------------------------
	// For add a price (integer) 
	// @param name string => Name of the field
	// @param value Integer => value of the field
	// @param value String => code of the currency
	// @param align string => alignment of the field (must be c, l, n or r)
	//
	// ------------------------------------------------------------------------
	public void addPrimaryField(String name, Integer value, String currency_code, String align ) {
		PKField field = new PKField();

		field.setKey(name);
		field.setLabel( name );
		field.setValue(value); 
		field.setCurrencyCode(currency_code);
		field.setTextAlignment( setFieldAlign(align) );
        
		this.primary_fields.add(field);
		
	}

	// ========================================================================
	//     S E C O N D A R Y   F I E L D S
	// ========================================================================
	// ------------------------------------------------------------------------
	//
	// @param name string => Name of the field
	// @param value string => value of the field
	// @param align string => alignment of the field (must be c, l, n or r)
	//
	public void addSecondaryField(String name, String value, String align ) {
		PKField field = new PKField();

		field.setKey(name);
		field.setLabel( name );
		field.setValue(value);
		field.setTextAlignment( setFieldAlign(align) );

		this.secondary_fields.add(field);

	}
	
	// ------------------------------------------------------------------------
	// For add a price 
	// @param name string => Name of the field
	// @param value Double => value of the field
	// @param value String => code of the currency
	// @param align string => alignment of the field (must be c, l, n or r)
	//
	public void addSecondaryField(String name, Double value, String currency_code, String align) {
		PKField field = new PKField();

		field.setKey(name);
		field.setLabel( name );
		field.setValue(value); 
		field.setCurrencyCode(currency_code);
		field.setTextAlignment( setFieldAlign(align) );
        
		this.secondary_fields.add(field);
		
	}
	
	// ------------------------------------------------------------------------
	// For add a price (integer) 
	// @param name string => Name of the field
	// @param value Integer => value of the field
	// @param value String => code of the currency
	// @param align string => alignment of the field (must be c, l, n or r)
	//
	// ------------------------------------------------------------------------
	public void addSecondaryField(String name, Integer value, String currency_code, String align ) {
		PKField field = new PKField();

		field.setKey(name);
		field.setLabel( name );
		field.setValue(value); 
		field.setCurrencyCode(currency_code);
		field.setTextAlignment( setFieldAlign(align) );
        
		this.secondary_fields.add(field);
		
	}

	// ==========================================================================
	
	// ---------------------------------------------------------------------------
	public void addLocaltions(double lat, double lng) {
		PKLocation location = new PKLocation();
		location.setLatitude(lat);
		location.setLongitude(lng);
		
		locations.add(location);
		
	}
	
	// ------------------------------------------------------------------------------
	public void setBarcodeData(String message) {
		ArrayList<PKBarcode> barcodes = new ArrayList<PKBarcode>();
		PKBarcode barcode = new PKBarcode();
		
		barcode.setFormat( PKBarcodeFormat.PKBarcodeFormatQR );
        barcode.setMessageEncoding(Charset.forName("utf-8"));
        barcode.setMessage(message);
        
        barcodes.add(barcode);
        
        pass.setBarcodes(barcodes);
	
	}
	
	// ===============================================================================
	// ===============================================================================
	// ===============================================================================
	// ===============================================================================
	private void createOutputFolder() {
		String validation_folder = working_folder_name + "/" + out_folder + "/" + out_folder_name + "/";

		if ( ! PassBook.fileExists(validation_folder)  ) {
			File dir = new File(validation_folder);
			dir.mkdir();
		}
		
	}
	
	// ------------------------------------------------------------------------
	private PKTextAlignment setFieldAlign(String align) {
		PKTextAlignment return_align = PKTextAlignment.PKTextAlignmentLeft;
		
		if (align == "c") {
			return_align = PKTextAlignment.PKTextAlignmentCenter;
		} else {
			if (align == "n") {
				return_align = PKTextAlignment.PKTextAlignmentNatural;
			} else {
				if (align == "r") {
					return_align = PKTextAlignment.PKTextAlignmentRight;
				} else {
					return_align = PKTextAlignment.PKTextAlignmentLeft;
				}
			}
		}	
		
		return return_align;
	}
	
	// ------------------------------------------------------------------------------
	private void setSignData() {
		
		DecimalFormat df = new DecimalFormat( "0000000000" );
		String sn        = df.format(this.num_serie++); 
		
		pass.setPassTypeIdentifier(sign_domain);
//		pass.setAuthenticationToken("vxwxd7J8AlNNFPS8k0a0FfUFtq0ewzFdc");
		pass.setSerialNumber( sn );
		pass.setTeamIdentifier(ubiqua_team_id); 
        pass.setOrganizationName(organization_name);
        
		
	}

	// ===============================================================================
	// ===============================================================================
	// @File data
	
	// ------------------------------------------------------------------------------
	static private boolean fileExists(String file_name_with_path) {
		
//		System.out.println( "fileExists => validando existencia de " +  file_name_with_path);
		File tmp_file = new File(file_name_with_path);
		
		return ( tmp_file.exists() ); 
	
	}

	// ------------------------------------------------------------------------------
	static private boolean isFolder(String file_name_with_path) {
		boolean ret_data = PassBook.fileExists(file_name_with_path);
		
		if ( ret_data ) {
			File tmp_file = new File(file_name_with_path);
			
			ret_data =  tmp_file.isDirectory();
		}
	
		return ret_data;
		
	}
	
	private static int re_levl= 0;
	private static String espacios = "";
	
	// ------------------------------------------------------------------------------
	public void prueba()  {

    	URL url = getClass().getResource(working_folder_name);
    	File folder = new File(url.getPath());
//    	System.out.println(folder.getAbsolutePath());
    	listFilesForFolder(folder);
    	
    }
    
    public static void listFilesForFolder(final File folder) {
    	System.out.println(espacios + "Tratando la carpeta " + folder.getName());

    	re_levl++;
    	espacios = "";
    	for (int i=0; i<re_levl; i++) {
    		espacios += " - ";
    	}
    	
        for (final File fileEntry : folder.listFiles()) {
            if (fileEntry.isDirectory()) {
                listFilesForFolder(fileEntry);
                re_levl--;
            } else {
                System.out.println(espacios + fileEntry.getName());
            }
        }
    	re_levl--;
    }

	
}
