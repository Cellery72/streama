package streama

import grails.transaction.Transactional

import static org.springframework.http.HttpStatus.*

@Transactional
class FileService {

  def allowedVideoFormats = ['.mp4', '.mkv', '.webm', '.ogg', '.m4v']

  def serveVideo(request, response, rawFile, File file) {
    def rangeHeader = request.getHeader("Range")
    //bytes=391694320-


    def fileLength = rawFile.length()
    def contentLength = rawFile.length().toString()
    def rangeEnd = fileLength.toLong()-1
    def rangeStart

    if(rangeHeader){
      rangeStart = rangeHeader.split("\\D+")[1].toLong()
      contentLength = fileLength - rangeStart
    }
    //add html5 video headers
    response.addHeader("Accept-Ranges", "bytes")
    response.addHeader("Content-Length", contentLength.toString())
    response.addHeader("Last-Modified", (new Date()).toString())
    response.addHeader("Cache-Control", 'public,max-age=3600,public')
    response.addHeader("Etag", file.sha256Hex)


    if(rangeHeader){
      response.addHeader("Content-Range", "bytes $rangeStart-$rangeEnd/$fileLength")
      response.setStatus(PARTIAL_CONTENT.value())
    }




    //Read and write bytes of file incrementally into the outputstream
    FileInputStream fis = new FileInputStream(rawFile) //391694394
    byte[] buffer = new byte[16000]

    if(rangeStart){
      fis.skip(rangeStart)
    }

    try{
      while (true){
        int read = fis.read(buffer)
        if (read == -1){
          break
        }
        response.outputStream.write(buffer, 0, read)
      }
      fis.close()
    }catch(Exception e){
//      e.printStackTrace()
//      e.getCause().printStackTrace()
    }
  }
}
