<?php

namespace App\Controllers;

//Controller Parent
use CodeIgniter\Controller;
//Model File
use App\Models\AdminModel;
use App\Models\ExperienceModel;
use App\Models\GenreModel;
use App\Models\MovieModel;
use App\Models\MovieExpModel;
use App\Models\MovieGenresModel;
use App\Models\MovieSentimentModel;
use App\Models\HallModel;
use App\Models\ScheduleModel;
use App\Models\ShowingModel;
use App\Models\SnacksModel;
use App\Models\BannersModel;
use App\Models\PaymentModel;
use App\Models\SnackPurchaseModel;
use App\Models\CustomerModel;
use App\Models\TicketsModel;
use CodeIgniter\Validation\Exceptions\ValidationException;
use Config\Services;

class AdminController extends Controller{
    //Model link var
    protected $admin;
    protected $experience;
    protected $genre;
    protected $movie;
    protected $movieExp;
    protected $movieGenres;
    protected $movieSentiment;
    protected $hall;
    protected $schedule;
    protected $showing;
    protected $snacks;
    protected $banners;
    protected $payment;
    protected $snackPurchase;
    protected $customer;
    protected $tickets;
    //Request var
    protected $request;

    public function __construct(){
        $this->admin = new AdminModel();
        $this->experience = new ExperienceModel();
        $this->genre = new GenreModel();
        $this->movie = new MovieModel();
        $this->movieExp = new MovieExpModel();
        $this->movieGenres = new MovieGenresModel();
        $this->movieSentiment = new MovieSentimentModel();
        $this->hall = new HallModel();
        $this->schedule = new ScheduleModel();
        $this->showing = new ShowingModel();
        $this->snacks = new SnacksModel();
        $this->banners = new BannersModel();
        $this->payment = new PaymentModel();
        $this->snackPurchase = new SnackPurchaseModel();
        $this->customer = new CustomerModel();
        $this->tickets = new TicketsModel();
        $this->request = \Config\Services::request();
    }

    function index(){
        return view('admin_login');
    }

    public function add(){
        try{

            $rules = [
                "name" => "required|min_length[3]|max_length[50]",
                "email" => "required|min_length[6]|max_length[50]|valid_email|is_unique[admin.email]",
                "password" => "required|min_lenth[8]|max_length[30]",
                "confpassword" => "matches[password]",
                "adminGroup" => "required"
            ];
    
            //if($this->validate($rules)){
                $json = $this->request->getJSON();
                $add['name'] = $json->name;
                $add['email'] = $json->email;
                $add['password'] = password_hash($json->password, PASSWORD_DEFAULT);
                $add['admin_group'] = $json->adminGroup;
    
                $res = $this->admin->insert($add);
    
                $response['success'] = true;
                $response['message'] = "Successfuly Added an Admin!";
    
                return json_encode($response);
            /*}
            else{
                $response['success'] = false;
                $response['message'] = "Failed to add Admin, Please check your input.";
            }*/
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = "Failed to add Admin, Please check your input.";
        }
    }

    public function login(){
        $rules = [
            'email' => 'required|min_length[6]|max_length[50]|valid_email',
            'password' => 'required|min_length[8]|max_length[255]|validateAdmin[email, password]',
        ];

        $errors = [
            'password' => [
                'validateAdmin' => 'Invalid login credentials provided'
            ]
        ];

        $json = $this->request->getJSON();
        $input['email']=$json->email;
        $input['password']=$json->password;

        if (!$this->validateRequest($input, $rules, $errors)) {
            $response['success'] = false;
            $response['message'] = $this->validator->getErrors();
            return json_encode($response);
        }
        else{
            $response['success'] = true;
            $response['message'] = "Successfully Authenticated!";
            
            $admin_data = $this->admin->where('email',$input['email'])->first();

            $session = session();
            $data = array("isLogged"=>"true","admin_id"=>$admin_data['id'],"admin_group"=>$admin_data['admin_group']);
            $session->set($data);

            return json_encode($response);
        }
    }

    private function validateRequest($input, array $rules, array $messages = []){
		$this->validator= Services::Validation()->setRules($rules);

		if(is_string($rules)){
			$validation = config('Validation');

			if(!isset($validation->$rules)){
				throw ValidationException::forRuleNotFound($rules);
			}

			$rules = $validation->$errorName ?? [];
		}

		return $this->validator->setRules($rules, $messages)->run($input);
	}

    public function list(){
        try{
            $data = $this->admin->findAll();
            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successful Load!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function getSession(){
        $session = session();

        if($session->get('isLogged')&&$session->get('admin_id')&&$session->get('admin_group')){
            $response['success'] = true;
            $response['isLogged'] = $session->get('isLogged');
            $response['id'] = $session->get('admin_id');
            $response['admin_group'] = $session->get('admin_group');
            
            return json_encode($response);
        }
        else{
            $response['success'] = false;

            return json_encode($response);
        }
    }

    public function getAdmin(){
        $session = session();
        
        if($session->get('admin_id')){
            $admin_data = $this->admin->find($session->get('admin_id'));

            $response['name'] = $admin_data['name'];
            $response['success'] = true;
            $response['message'] = "Retrieved Successfully!";

            return json_encode($response);
        }
        else{
            $response['success'] = false;
            $response['message'] = "Retrieve Failed!";

            return json_encode($response);
        }
    }

    public function addExperience(){
        try{
            $experience['name'] = $this->request->getPost("name");
            $experience['description'] = $this->request->getPost("description");
            $experience['surcharge'] = $this->request->getPost("surcharge");

            $dir_path = "../cinema_project/public/img/exp_logo";
            $file = $this->request->getFile('logo');
            $name = $file->getRandomName();
            $extension = $file->getExtension();
            $file->move($dir_path,$name);

            $experience['logo'] = "/cinema_project/public/img/exp_logo/" . $name;

            $this->experience->insert($experience);

            $response['success'] = true;
            $response['message'] = "Successfully added!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = "Failed to add Experience, Please check your input.";

            return json_encode($response);
        }
    }

    public function getExperience(){
        try{
            $data = $this->experience->findAll();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successful Load!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function deleteExperience($id){
        try{
            $data = $this->experience->find($id);
            $file_path = "..".$data['logo'];
            unlink($file_path);

            if($res = $this->experience->delete($id)){
                $this->movieExp->where("exp_id",$id)->delete();
                if($halls = $this->hall->where('exp_id',$id)->findAll()){
                    $tmp['exp_id']=0;
                    $tmp['updated_at']=date("Y-m-d");

                    foreach($halls as $hall){
                        $this->hall->update($hall['hall_id'],$tmp);
                    }
                }
            }

            $response['res'] = $res;
            $response['success'] = true;
            $response['message'] = "Deleted Successfully!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function editExperience($id){
        try{
            $data['name'] = $this->request->getPost("name");
            $data['description'] = $this->request->getPost("description");
            $data['surcharge'] = $this->request->getPost("surcharge");

            if($file = $this->request->getFile('logo')){

                $dir_path = "../cinema_project/public/img/exp_logo";
                
                $del = $this->experience->find($id);
                $file_path = "..".$del['logo'];
                unlink($file_path);

                $name = $file->getRandomName();
                $extension = $file->getExtension();
                $file->move($dir_path,$name);

                $data['logo'] = "/cinema_project/public/img/exp_logo/" . $name;
            }

            $res = $this->experience->update($id,$data);

            $response['success'] = true;
            $response['message'] = "Successfully Edited!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function getGenre(){
        try{
            $data = $this->genre->findAll();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Added!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function addGenre(){
        try{
            $genre['genre'] = $this->request->getPost('genre');

            $this->genre->insert($genre);

            $response['success'] = true;
            $response['message'] = "Successfully Added!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function editGenre($id){
        try{
            $genre['genre'] = $this->request->getPost('genre');
            $genre['updated_at'] = date("Y-m-d h:i:s",time());

            $res = $this->genre->update($id,$genre);

            $response['success'] = true;
            $response['message'] = "Successfully Edited!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function deleteGenre($id){
        try{
            if($res = $this->genre->delete($id)){
                $this->movieGenres->where("genre_id",$id)->delete();
            }

            $response['res'] = $res;
            $response['success'] = true;
            $response['message'] = "Successfully Deleted!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function addMovie(){
        try{
            $movie['title'] = $this->request->getPost('title');
            $movie['cast'] = $this->request->getPost('cast');
            $movie['director'] = $this->request->getPost('director');
            $movie['distributor'] = $this->request->getPost('distributor');
            $movie['synopsis'] = $this->request->getPost('synopsis');
            $movie['price'] = $this->request->getPost('price');
            $movie['duration'] = $this->request->getPost('duration');

            $input_genres = json_decode($this->request->getPost('genre'),true);
            $input_exp = json_decode($this->request->getPost('experience'),true);

            $movie['show_start'] = $this->request->getPost('show_start');
            $movie['show_end'] = $this->request->getPost('show_end');
            
            if($file = $this->request->getFile('poster')){
                $dir_path = "../cinema_project/public/img/movies";
                $name = $file->getRandomName();
                $extension = $file->getExtension();
                $file->move($dir_path,$name);

                $movie['poster'] = "/cinema_project/public/img/movies/" . $name;
            }

            $movie['trailer'] = $this->request->getPost('trailer');

            $this->movie->insert($movie);

            $temp = $this->movie->where($movie)->first();
            $genres = array();

            foreach($input_genres as $genre){
                $genres[] = array('movie_id'=>$temp['movie_id'],'genre_id'=>$genre);
            }

            $exp = array();

            foreach($input_exp as $x){
                $exp[] = array('movie_id'=>$temp['movie_id'],'exp_id'=>$x);
            }

            foreach($genres as $genre){
                $this->movieGenres->insert($genre);
            }
            foreach($exp as $x){
                $this->movieExp->insert($x);
            }
            
            $command = escapeshellcmd('py d:/xampp/htdocs/cinema_project/public/python/main.py "' .$temp['title'].'" '.$temp['movie_id'].' '.'0');
            $output = shell_exec($command);

            $response['success'] = true;
            $response['message'] = "Successfully Added!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function getMovies(){
        try{
            $movie = $this->movie->findAll();

            for($i=0;$i<sizeof($movie);$i++){
                $tmp_id = $movie[$i]['movie_id'];
                $genre=array();
                $exp=array();

                $tmp_genre = $this->movieGenres->where('movie_id',$tmp_id)->findAll();
                foreach($tmp_genre as $g){
                    $genre[]=$this->genre->find($g['genre_id']);
                }
                $tmp_experience = $this->movieExp->where('movie_id',$tmp_id)->findAll();
                foreach($tmp_experience as $e){
                    $exp[]=$this->experience->find($e['exp_id']);
                }

                $movie[$i]['genre']=$genre;
                $movie[$i]['experience']=$exp;
            }

            $response['data'] = $movie;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function editMovie($id){
        try{
            $movie['title'] = $this->request->getPost('title');
            $movie['cast'] = $this->request->getPost('cast');
            $movie['director'] = $this->request->getPost('director');
            $movie['distributor'] = $this->request->getPost('distributor');
            $movie['synopsis'] = $this->request->getPost('synopsis');
            $movie['price'] = $this->request->getPost('price');
            $movie['duration'] = $this->request->getPost('duration');

            $input_genres = json_decode($this->request->getPost('genre'),true);
            $input_exp = json_decode($this->request->getPost('experience'),true);

            $movie['show_start'] = $this->request->getPost('show_start');
            $movie['show_end'] = $this->request->getPost('show_end');
            
            if($file = $this->request->getFile('poster')){
                $del = $this->movie->find($id);
                $file_path = "..".$del['poster'];
                unlink($file_path);

                $dir_path = "../cinema_project/public/img/movies";
                $name = $file->getRandomName();
                $extension = $file->getExtension();
                $file->move($dir_path,$name);

                $movie['poster'] = "/cinema_project/public/img/movies/" . $name;
            }

            $movie['trailer'] = $this->request->getPost('trailer');
            $movie['updated_at'] = date("Y-m-d h:i:s",time());

            $res = $this->movie->update($id,$movie);

            $temp = $this->movie->find($id);
            $genres = array();

            foreach($input_genres as $genre){
                $genres[] = array('movie_id'=>$temp['movie_id'],'genre_id'=>$genre);
            }

            $exp = array();

            foreach($input_exp as $x){
                $exp[] = array('movie_id'=>$temp['movie_id'],'exp_id'=>$x);
            }

            $this->movieGenres->where("movie_id",$id)->delete();
            $this->movieExp->where("movie_id",$id)->delete();

            foreach($genres as $genre){
                $this->movieGenres->insert($genre);
            }
            foreach($exp as $x){
                $this->movieExp->insert($x);
            }

            $response['success'] = true;
            $response['message'] = "Successfully Edited!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function deleteMovie($id){
        try{
            $tmp = $this->movie->find($id);
            $file_path = "..".$tmp['poster'];
            unlink($file_path);

            if($this->movie->delete($id)){
                $this->movieExp->where("movie_id",$id)->delete();
                $this->movieGenres->where("movie_id",$id)->delete();
                $this->movieSentiment->where("movie_id",$id)->delete();
            }

            $response['success'] = true;
            $response['message'] = "Successfully Deleted!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function filterMovies(){
        try{
            $filter=array();
            if($this->request->getPost("filter_by") != NULL){
                $tmp = $this->request->getPost("filter_by");

                switch($tmp){
                    case "show":
                        if($this->request->getPost("filter_option") != NULL){
                            switch($this->request->getPost("filter_option")){
                                case 1:
                                    $filter['show_start <='] = date("Y-m-d");
                                    $filter['show_end >='] = date("Y-m-d");
                                    break;
                                case 2:
                                    $filter['show_start >'] = date("Y-m-d");
                                    $filter['show_end >'] = date("Y-m-d");
                                    break;
                            }
                        }
                        break;
                    case "genre":
                        if($this->request->getPost("filter_option") != NULL){
                            $gid = $this->request->getPost("filter_option");
                            $arr = $this->movieGenres->select("movie_id")->where("genre_id",$gid)->findAll();
                            $genre=array();
                            foreach($arr as $item){
                                $genre[]=$item['movie_id'];
                            }
                            $this->movie->whereIn('movie_id',$genre);
                        }
                        break;
                    case "exp":
                        if($this->request->getPost("filter_option") != NULL){
                            $eid = $this->request->getPost("filter_option");
                            $arr = $this->movieExp->select("movie_id")->where("exp_id",$eid)->findAll(); 
                            $exp=array();
                            foreach($arr as $item){
                                $exp[]=$item['movie_id'];
                            }
                            $this->movie->whereIn('movie_id',$exp);
                        }
                        break;
                }

            }
            
            if($this->request->getPost('search')!=NULL){
                $this->movie->like('title',$this->request->getPost('search'));
            }
                
            if(isset($filter)){
                $data = $this->movie->where($filter)->findAll();
            }
            else{
                $data = $movie->findAll();
            }

            for($i=0;$i<sizeof($data);$i++){
                $tmp_id = $data[$i]['movie_id'];
                $genre=array();
                $exp=array();

                $tmp_genre = $this->movieGenres->where('movie_id',$tmp_id)->findAll();
                foreach($tmp_genre as $g){
                    $genre[]=$this->genre->find($g['genre_id']);
                }
                $tmp_experience = $this->movieExp->where('movie_id',$tmp_id)->findAll();
                foreach($tmp_experience as $e){
                    $exp[]=$this->experience->find($e['exp_id']);
                }

                $data[$i]['genre']=$genre;
                $data[$i]['experience']=$exp;
            }

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Filtered!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }
    
    public function runSentimentScript(){
        try{
            $to_update=$this->movie->select('movie_id, title')->where('show_end >', date("Y-m-d"))->findAll();
            for($i=0;$i<sizeof($to_update);$i++){
                $tmp=$this->movieSentiment->selectMax('id')->where('movie_id',$to_update[$i]['movie_id'])->findAll();
                if($tmp[0]['id']!=NULL){
                    $since_id = $this->movieSentiment->select('since_id')->find($tmp[0]['id']);

                    $to_update[$i]['since_id'] = $since_id['since_id'];
                }
                else{
                    $to_update[$i]['since_id'] = 0; 
                }

                $date = $this->movieSentiment->selectMax('date')->where('movie_id',$to_update[$i]['movie_id'])->findAll();
                if(strtotime($date[0]['date']) != strtotime(date("Y-m-d"))){
                    $command = escapeshellcmd('py d:/xampp/htdocs/cinema_project/public/python/main.py "' .$to_update[$i]['title'].'" '.$to_update[$i]['movie_id'].' '.$to_update[$i]['since_id']);
                    $output = shell_exec($command);
                }
            }
            $response['success'] = true;
            $response['message'] = "Successfully Updated Movie Sentiment!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function getMovie($id){
        try{
            $data = $this->movie->find($id);

            $genre=array();
            $exp=array();
            $tmp_genre = $this->movieGenres->where('movie_id',$data['movie_id'])->findAll();
            foreach($tmp_genre as $g){
                $genre[]=$this->genre->find($g['genre_id']);
            }
            $tmp_experience = $this->movieExp->where('movie_id',$data['movie_id'])->findAll();
            foreach($tmp_experience as $e){
                $exp[]=$this->experience->find($e['exp_id']);
            }
            $data['genre']=$genre;
            $data['exp']=$exp;
            $sentiment = $this->movieSentiment->selectCount('id')->selectAvg('avg_comp')->selectSum('no_pos')->selectSum('no_neg')->where('movie_id',$data['movie_id'])->findAll();
            $data['avg_comp'] = $sentiment[0]['avg_comp'];
            $data['no_pos'] = $sentiment[0]['no_pos'];
            $data['no_neg'] = $sentiment[0]['no_neg'];
            $data['count'] = $sentiment[0]['id'] * 100;

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved Movie Data!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function addHall(){
        try{
            $input['exp_id'] = $this->request->getPost('exp_id');
            $this->hall->insert($input);

            $response['success'] = true;
            $response['message'] = "Successfully Added!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function getHalls(){
        try{
            $data = $this->hall->findAll();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function deleteHall($id){
        try{
            $this->hall->delete($id);

            $response['success'] = true;
            $response['message'] = "Successfully Deleted!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();

            return json_encode($response);
        }
    }

    public function editHall($id){
        try{
            $input['exp_id'] = $this->request->getPost('exp_id');
            $input['updated_at'] = date("Y-m-d");

            $this->hall->update($id,$input);

            $response['success'] = true;
            $response['message'] = "Successfully Edited!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function getHall($id){
        try{
            $data = $this->hall->find($id);

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function getSchedule(){
        try{
            $where['hall_id'] = $this->request->getPost('hall_id');
            $where['start_date'] = $this->request->getPost('start_date');
            $where['end_date'] = $this->request->getPost('end_date');

            if($sch = $this->schedule->where($where)->first()){
                $show = $this->showing->where('schedule_id',$sch['schedule_id'])->distinct()->select("hall_id, schedule_id, exp_id, movie_id, duration, name, price, start_time,end_time,enabled_by")->findAll();

                $data['schedule'] = $sch;
                $data['showing'] = $show;
            }
            else{
                $input['hall_id'] = $this->request->getPost('hall_id');
                $input['exp_id'] = $this->request->getPost('exp_id');
                $input['start_date'] = $this->request->getPost('start_date');
                $input['end_date'] = $this->request->getPost('end_date');
                $input['schedule_by'] = $this->request->getPost('schedule_by');

                $this->schedule->insert($input);

                $sch = $this->schedule->where($where)->first();

                $data['schedule'] = $sch;
                $data['showing'] = array();
            }
            
            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function getSchedulableMovies(){
        try{
            $input['exp_id'] = $this->request->getPost('exp_id');
            $exp = $this->movieExp->where('exp_id',$input['exp_id'])->select('movie_id')->findAll();
            $ids = array();
            foreach($exp as $e){
                $ids[] = $e['movie_id'];
            }

            $where['show_start <='] = $this->request->getPost('start_date');
            $where['show_start <'] = $this->request->getPost('end_date');
            $where['show_end >='] = $this->request->getPost('end_date');
            $where['show_end >'] = $this->request->getPost('start_date');
            $data = $this->movie->whereIn('movie_id',$ids)->where($where)->findAll();

            for($i=0;$i<sizeof($data);$i++){
                $sentiment = $this->movieSentiment->selectAvg('avg_comp')->where('movie_id',$data[$i]['movie_id'])->findAll();
                $data[$i]['avg_comp'] = $sentiment[0]['avg_comp'];
            }

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function addShowing(){
        try{
            $id = $this->request->getPost('schedule_id');
            $sch = json_decode($this->request->getPost('showings'),true);
            $start = $this->request->getPost('start_date');
            $end = $this->request->getPost('end_date');

            $this->showing->where('schedule_id',$id)->delete();

            $seating = array();
            $row = array();

            for($i=0; $i<12; $i++){
                $row[] = 0;
            }

            for($i=0; $i<8; $i++){
                $seating[]=$row;
            }

            $cur = date_create($start);
            for($d=0;$d<7;$d++){
                for($i=0;$i<sizeof($sch);$i++){
                    $sch[$i]['show_date']=date_format($cur,"Y-m-d");
                    $sch[$i]['seating'] = json_encode($seating);
                    $sch[$i]['num_seats'] = 96;

                    $this->showing->insert($sch[$i]);
                }
                date_add($cur,date_interval_create_from_date_string("1 days"));
            }

            $response['success'] = true;
            $response['message'] = "Successfully Saved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function addSnack(){
        try{
            $input['name'] = $this->request->getPost('name');
            $input['price'] =$this->request->getPost('price');

            $dir_path = "../cinema_project/public/img/snacks";
            $file = $this->request->getFile('img');
            $name = $file->getRandomName();
            $extension = $file->getExtension();
            $file->move($dir_path,$name);

            $input['img'] = "/cinema_project/public/img/snacks/" . $name;

            $this->snacks->insert($input);

            $response['success'] = true;
            $response['message'] = "Successfully Added!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function getSnacks(){
        try{
            $data = $this->snacks->findAll();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Added!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function editSnack($id){
        try{
            $input['name'] = $this->request->getPost('name');
            $input['price'] =$this->request->getPost('price');

            if($file = $this->request->getFile('img')){

                $dir_path = "../cinema_project/public/img/snacks";
                
                $del = $this->snacks->find($id);
                $file_path = "..".$del['img'];
                unlink($file_path);

                $name = $file->getRandomName();
                $extension = $file->getExtension();
                $file->move($dir_path,$name);

                $input['img'] = "/cinema_project/public/img/snacks/" . $name;
            }

            $this->snacks->update($id,$input);

            $response['success'] = true;
            $response['message'] = "Successfully Edited!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function deleteSnack($id){
        try{
            $del = $this->snacks->find($id);
            $file_path = "..".$del['img'];
            unlink($file_path);

            $this->snacks->delete($id);

            $response['success'] = true;
            $response['message'] = "Successfully Deleted!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function addBanner(){
        try{
            $input['link'] = $this->request->getPost('link');
            $input['status'] =$this->request->getPost('status');

            $dir_path = "../cinema_project/public/img/banners";
            $file = $this->request->getFile('img');
            $name = $file->getRandomName();
            $extension = $file->getExtension();
            $file->move($dir_path,$name);

            $input['img'] = "/cinema_project/public/img/banners/" . $name;

            $this->banners->insert($input);

            $response['success'] = true;
            $response['message'] = "Successfully Added!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function getBanners(){
        try{
            $data = $this->banners->findAll();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function editBanner($id){
        try{
            $input['link'] = $this->request->getPost('link');
            $input['status'] =$this->request->getPost('status');

            if($file = $this->request->getFile('img')){

                $dir_path = "../cinema_project/public/img/banners";
                
                $del = $this->banners->find($id);
                $file_path = "..".$del['img'];
                unlink($file_path);

                $name = $file->getRandomName();
                $extension = $file->getExtension();
                $file->move($dir_path,$name);

                $input['img'] = "/cinema_project/public/img/banners/" . $name;
            }

            $this->banners->update($id,$input);

            $response['success'] = true;
            $response['message'] = "Successfully Edited!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function deleteBanner($id){
        try{
            $del = $this->banners->find($id);
            $file_path = "..".$del['img'];
            unlink($file_path);

            $this->banners->delete($id);

            $response['success'] = true;
            $response['message'] = "Successfully Deleted!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function getDashboardData(){
        try{
            //Profit Data
            $chart = array();
            $labels = array();

            for($j=0; $j<12;$j++)
                $labels[] = date("F", mktime(0, 0, 0, $j+1, 1));

            for($i=0; $i<5; $i++){
                $where = array();
                
                for($j=0; $j<12;$j++){
                    $where['date >='] = date('Y-m-d',mktime(0, 0, 0, $j+1, 1,date('Y')-$i));
                    $where['date <'] = date('Y-m-d',strtotime("+1 months", mktime(0, 0, 0, $j+1, 1,date('Y')-$i)));

                    if(($this->payment->selectSum('total')->where($where)->first())['total'] != NULL)
                        $chart[$i][] = ($this->payment->selectSum('total')->where($where)->first())['total'];
                    else
                        $chart[$i][] = "0";
                }
            }

            $data['profit']['labels'] = $labels;
            $data['profit']['data'] = $chart;

            //Ticket Sales
            $labels = array();
            $chart = array();
            $where = array();
            $tmp = array();

            for($j=0; $j<12;$j++)
                $labels[] = date("F", mktime(0, 0, 0, $j+1, 1));

            for($i=0; $i<5; $i++){
                $where = array();
                
                for($j=0; $j<12;$j++){
                    $where['show_date >='] = date('Y-m-d',mktime(0, 0, 0, $j+1, 1,date('Y')-$i));
                    $where['show_date <'] = date('Y-m-d',strtotime("+1 months", mktime(0, 0, 0, $j+1, 1,date('Y')-$i)));

                    $tmp = $this->showing->selectSum('num_seats','seats_left')->selectCount('showing_id','count')->where($where)->first();
                
                    if($tmp['seats_left'] != NULL && $tmp['count'] != 0)
                        $chart[$i][] = (96 * $tmp['count']) - ($tmp['seats_left']);
                    else
                        $chart[$i][]= "0";
                }
            }

            $data['ticket_sales']['labels'] = $labels;
            $data['ticket_sales']['data'] = $chart;

            $data['others']['cust_count']=($this->customer->selectCount('id','cust_count')->first())['cust_count'];
            $data['others']['total_profit']=($this->payment->selectSum('total','total_profit')->where('date <=',date('Y-m-d',strtotime('12/31')))->first())['total_profit'];
            $tmp = $this->showing->selectSum('num_seats','seats_left')->selectCount('showing_id','count')->where('show_date <=',date('Y-m-d',strtotime('12/31')))->first();
            $data['others']['tickets_sold']=(96*$tmp['count'])-$tmp['seats_left'];
            $data['others']['snacks_sold']=($this->snackPurchase->select('snack_purchase.payment_id')->join('payment','payment.payment_id = snack_purchase.payment_id')->select('payment.date')->selectSum('qty','snacks_sold')->where('payment.date <=',date('Y-m-d',strtotime('12/31')))->first())['snacks_sold'];

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function getSnackSales(){
        try{
            //Snack Sales Data
            $labels = array();
            $chart = array();
            $where = array();
            $tmp = array();

            if($this->request->getPost('snack_start')!=NULL)
                $where['date >='] = $this->request->getPost('snack_start');
            if($this->request->getPost('snack_end')!=NULL)
                $where['date <='] = $this->request->getPost('snack_end');
            
            $tmp_id = $this->payment->select('payment_id')->where($where)->find();
            if($tmp_id != NULL){
                for($i=0;$i<sizeof($tmp_id);$i++){
                    $tmp[]=$tmp_id[$i]['payment_id'];
                }
            }
            else{
                $tmp[]=NULL;
            }

            $tmp = $this->snackPurchase->select('snack_purchase.snack_id')->selectSum('qty')->groupBy('snack_purchase.snack_id')->orderBy('SUM(qty)','DESC')->join('snacks','snacks.snack_id = snack_purchase.snack_id')->select('snacks.name')->whereIn('payment_id',$tmp)->find();
            
            for($i=0;$i<sizeof($tmp);$i++){
                $labels[] = $tmp[$i]['name'];
                $chart[] = $tmp[$i]['qty'];
            }
            $data['snack_sales']['labels'] = $labels;
            $data['snack_sales']['data'] = $chart;

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function getMovieSales(){
        try{
            //Movie Sales Data
            if($this->request->getPost('m1')!=NULL && $this->request->getPost('m2')!=NULL){
                $ids = array();
                $ids[] = $this->request->getPost('m1');
                $ids[] = $this->request->getPost('m2');
                
                $movies = $this->movie->select('movie_id, title')->whereIn('movie_id',$ids)->find();
            }
            else
                $movies = $this->movie->select('movie_id, title')->find();

            $labels = array();
            $chart = array();

            for($i=0;$i<sizeof($movies);$i++){
                $labels[] = $movies[$i]['title'];
                $tmp = $this->showing->selectCount('showing_id')->selectSum('num_seats')->where('movie_id',$movies[$i]['movie_id'])->first();

                $chart[] = (96 * $tmp['showing_id']) - $tmp['num_seats'];
            }
            $data['movie_sales']['labels'] = $labels;
            $data['movie_sales']['data'] = $chart;

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }

    public function getSentimentRecommendation(){
        try{
            $where['show_start <='] = date("Y-m-d");
            $where['show_end >='] = date("Y-m-d");
            $tmp = $this->movie->select('movie_id')->where($where)->find();
            for($i=0;$i<sizeof($tmp);$i++){
                $tmp[$i] = $tmp[$i]['movie_id'];
            }

            $data['increase'] = $sentiment = $this->movieSentiment->select('movie_sentiment.movie_id')->selectAvg('movie_sentiment.avg_comp')->whereIn('movie_sentiment.movie_id',$tmp)->groupBy('movie_sentiment.movie_id')->having('avg_comp >',0.5)->join('movies','movie_sentiment.movie_id = movies.movie_id')->select('movies.title')->orderBy('avg_comp','DESC')->limit(3)->find();
            $data['decrease'] = $sentiment = $this->movieSentiment->select('movie_sentiment.movie_id')->selectAvg('movie_sentiment.avg_comp')->whereIn('movie_sentiment.movie_id',$tmp)->groupBy('movie_sentiment.movie_id')->having('avg_comp <',0.5)->join('movies','movie_sentiment.movie_id = movies.movie_id')->select('movies.title')->orderBy('avg_comp','ASC')->limit(3)->find();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
        }
    }
}

?>