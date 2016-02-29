

streamaApp.controller('adminMovieCtrl', [
	'$scope', 'apiService', '$stateParams', 'modalService', '$state', 'uploadService',
	function ($scope, apiService, $stateParams, modalService, $state, uploadService) {
    $scope.loading = true;

		apiService.movie.get($stateParams.movieId).success(function (data) {
			$scope.movie = data;
      $scope.loading = false;
		});

    $scope.openMovieModal = function () {
      modalService.movieModal($scope.movie, function (data) {
        angular.merge($scope.movie, data)
      });
    };

		$scope.delete = function(){
			alertify.confirm("Are you sure, you want to delete this Movie?", function (confirmed) {
				if(confirmed){
					apiService.movie.delete($stateParams.movieId).success(function () {
						$state.go('admin.movies');
					});
				}
			})
		};

		$scope.addToCurrentNotification = function(){
			apiService.notification.addMovieToCurrentNotification($stateParams.movieId).success(function () {
				alertify.success('The movie was added to the current notification queue.');
			});
		};

    $scope.manageFiles = function(movie){
      modalService.fileManagerModal(movie);
    };


		$scope.addSimilarMovieToStreama = function(movie, redirect){
      alertify.set({
        buttonReverse: true,
        labels: {
          ok     : "Yes",
          cancel : "Cancel"
        } });

			alertify.confirm("Do you want to add \""+ movie.title +"\" to the Streama library?", function (confirmed) {
				if(confirmed){

          var apiId = movie.id;
          delete movie.id;
          movie.apiId = apiId;

          apiService.movie.save(movie).success(function (data) {
						if(redirect){
							$state.go('admin.movie', {movieId: data.id});
						}
          });
				}
			})
		};

		$scope.uploadStatus = {};

		$scope.upload = uploadService.doUpload.bind(uploadService, $scope.uploadStatus, 'video/uploadFile.json?id=' + $stateParams.movieId, function (data) {
			$scope.uploadStatus.percentage = null;
			$scope.movie.files = $scope.movie.files || [];
			$scope.movie.files.push(data);
		});



		$scope.onTagSelect = function (tag) {
			apiService.tag.save(tag);
			apiService.movie.save($scope.movie);
		};

		$scope.tagTransform = function (newTag) {
			var item = {
				name: newTag,
				isNew: true
			};

			return item;
		};

		$scope.deleteTag = function (tag) {
				alertify.confirm('Are you sure you want to delete the tag ' + tag.name, function (confirmed) {
					if(confirmed){
						apiService.tag.delete(tag.id).success(function () {
							_.remove($scope.tags, {id: tag.id});
						})
					}
				});
		};

		apiService.tag.list().success(function (data) {
			$scope.tags = data;
		});


}]);
