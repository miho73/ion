package com.github.miho73.ion.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;

@Component
@Slf4j
public class Requests {

    public static String sendGetRequest(String urlStr) throws IOException {
        return new String(sendGetRequestByte(urlStr), StandardCharsets.UTF_8);
    }

    public static byte[] sendGetRequestByte(String urlStr) throws IOException {
        URL url = new URL(urlStr);
        InputStream inStream = null;
        URLConnection connection = url.openConnection();
        HttpURLConnection httpConnection = (HttpURLConnection) connection;
        int responseCode = httpConnection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            inStream = httpConnection.getInputStream();
        }
        return inputStreamToByte(inStream);
    }

    public static byte[] inputStreamToByte(InputStream is) {
        try {
            ByteArrayOutputStream bytestream = new ByteArrayOutputStream();
            int ch;
            while ((ch = is.read()) != -1) {
                bytestream.write(ch);
            }
            byte[] data = bytestream.toByteArray();
            bytestream.close();
            return data;
        } catch (Exception e) {
            log.error("Http request failed", e);
        }

        return null;
    }
}
