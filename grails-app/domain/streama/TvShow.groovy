package streama

class TvShow {

  transient theMovieDbService


  Boolean deleted = false
  Boolean manualInput = false

  Date dateCreated
  Date lastUpdated

  String name
  String overview
  String apiId

  String backdrop_path
  String poster_path
  String first_air_date
  String original_language
  String imdb_id

  Double vote_average
  Integer vote_count
  Double popularity
  static hasMany = [episodes: Episode]


  File poster_image
  File backdrop_image

  static mapping = {
    cache true
    episodes cache: true
  }


  static constraints = {
      name nullable: false
      overview size: 1..5000
  }

  def getExternalLinks(){
    theMovieDbService.getExternalLinks(this.apiId)
  }
}
