<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\CustomerModel;
use App\Models\BannersModel;
use App\Models\MovieModel;
use App\Models\MovieSentimentModel;
use App\Models\MovieGenresModel;
use App\Models\GenreModel;
use App\Models\ExperienceModel;
use App\Models\MovieExpModel;
use App\Models\ShowingModel;
use App\Models\SnacksModel;
use App\Models\PaymentModel;
use App\Models\TicketsModel;
use App\Models\SnackPurchaseModel;

use CodeIgniter\Validation\Exceptions\ValidationException;
use Config\Services;

class CustomerController extends Controller{
    
    protected $customer;
    protected $request;
    protected $banner;
    protected $movie;
    protected $sentiment;
    protected $movieGenres;
    protected $genre;
    protected $exp;
    protected $movieExp;
    protected $showing;
    protected $snacks;
    protected $payment;
    protected $tickets;
    protected $snackPurchase;

    public function __construct(){
        $this->customer = new CustomerModel();
        $this->banner = new BannersModel();
        $this->movie = new MovieModel();
        $this->sentiment = new MovieSentimentModel();
        $this->movieGenres = new MovieGenresModel();
        $this->genre = new GenreModel();
        $this->exp = new ExperienceModel();
        $this->movieExp = new MovieExpModel();
        $this->showing = new ShowingModel();
        $this->snacks = new SnacksModel();
        $this->payment = new PaymentModel();
        $this->tickets = new TicketsModel();
        $this->snackPurchase = new SnackPurchaseModel();

        $this->request = \Config\Services::request();
    }

    function index(){
        return view('customer');
    }

    public function addCustomer(){
        try{
            $rules = [
                "name" => "required|min_length[3]|max_length[50]",
                "email" => "required|min_length[6]|max_length[50]|valid_email|is_unique[customer.email]",
                "password" => "required|min_length[8]|max_length[30]",
                "confpassword" => "matches[password]",
                "phone" => "required|numeric|min_length[10]|max_length[10]",
                "address" => "required"
            ];

            $errors = [
                'confpassword' => [
                    'matches' => 'Confirm Password does not match Password'
                ],
                'email' => [
                    'is_unique' => "This email has been taken"
                ]
            ];

            $insert['name'] = $this->request->getPost('name');
            $insert['email'] = $this->request->getPost('email');
            $insert['phone'] = $this->request->getPost('phone');
            $insert['address'] = $this->request->getPost('address');
            
            $tmp = $insert;
            $tmp['confpassword'] = $this->request->getPost('confpassword');
            $tmp['password'] = $this->request->getPost('password');

            $insert['password'] = password_hash($this->request->getPost('password'), PASSWORD_DEFAULT);

            if (!$this->validateRequest($tmp, $rules,$errors)) {
                $response['success'] = false;
                $response['message'] = $this->validator->getErrors();
                return json_encode($response);
            }
            else{
                $this->customer->insert($insert);

                $response['success'] = true;
                $response['message'] = "Successfully Added!";
                return json_encode($response);
            }
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function loginCustomer(){
        try{
            $rules = [
                'email' => 'required|valid_email',
                'password' => 'required|validateCustomer[email, password]',
            ];
    
            $errors = [
                'password' => [
                    'validateCustomer' => 'Invalid login credentials provided'
                ]
            ];
    
            $input['email']=$this->request->getPost('email');
            $input['password']=$this->request->getPost('password');
    
            if (!$this->validateRequest($input, $rules, $errors)) {
                $response['success'] = false;
                $response['message'] = $this->validator->getErrors();
                return json_encode($response);
            }
            else{
                $cust_data = $this->customer->where('email',$input['email'])->first();
    
                $session = session();
                $data = array("isLogged"=>true,"cust_id"=>$cust_data['id']);
                $session->set($data);
                
                $response['data'] = $data;
                $response['success'] = true;
                $response['message'] = "Successfully Logged In!";
                return json_encode($response);
            }
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

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

    public function getCustSession(){
        try{
            $session = session();

            if($session->get('isLogged')&&$session->get('cust_id')){
                $session_data['isLogged'] = $session->get('isLogged');
                $session_data['cust_id'] = $session->get('cust_id');

                $response['data'] = $session_data;
                $response['success'] = true;
                $response['message'] = "Logged In";

                return json_encode($response);
            }
            else{
                $response['success'] = false;
                $response['message'] = "Not Logged In";
    
                return json_encode($response);
            }
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function logoutCustomer(){
        try{
            $session = session();

            $session->destroy();

            $response['success'] = true;
            $response['message'] = "Successfully Logged Out!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function getEnabledBanners(){
        try{
            $data = $this->banner->where('status',1)->find();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function getShowingMovies(){
        try{
            $where['show_start <='] = date("Y-m-d");
            $where['show_end >='] = date("Y-m-d");
            $data = $this->movie->where($where)->find();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function getUpcomingMovies(){
        try{
            $where['show_start >'] = date("Y-m-d");
            $where['show_end >'] = date("Y-m-d");
            $data = $this->movie->where($where)->find();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function getPopularMovies(){
        try{
            $where['show_start <='] = date("Y-m-d");
            $where['show_end >='] = date("Y-m-d");
            $data = $this->sentiment->selectAvg('avg_comp')->groupBy('movie_sentiment.movie_id')->orderBy('avg_comp','DESC')->join('movies','movies.movie_id = movie_sentiment.movie_id')->limit(1)->select('movies.*')->where($where)->limit(10)->find();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function searchMovie(){
        try{
            $input['search_term'] = $this->request->getPost('search_term');

            if(!empty($input['search_term'])){
                $data = $this->movie->like('title',$input['search_term'])->findAll();
            }
            else{
                $data=array();
            }
            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function getMovieDetail($id){
        try{
            $data = $this->movie->find($id);

            $tmp_genre = $this->movieGenres->select('genre_id')->where('movie_id',$id)->find();
            $genres = array();

            foreach($tmp_genre as $genre){
                $genres[] = $this->genre->select('genre')->find($genre['genre_id']);
            }
            $data['genres'] = $genres;

            $tmp_exp = $this->movieExp->select('exp_id')->where('movie_id',$id)->find();
            $exps = array();

            foreach($tmp_exp as $exp){
                $exps[] = $this->exp->select('exp_id,name')->find($exp['exp_id']);
            }
            $data['exps'] = $exps;

            $where['movie_id'] = $id;
            $where['show_date >'] = date('Y-m-d');
            $where['enabled_by <'] = date('Y-m-d');
            $where['num_seats >'] = 0;

            $showings = $this->showing->where($where)->find();

            $data['showings'] = $showings;

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function getShowing($id){
        try{
            $data = $this->showing->find($id);

            $data['seating'] = json_decode($data['seating'],true);

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function getSnacks(){
        try{
            $data = $this->snacks->findAll();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function paymentSuccess(){
        try{
            
            $showing_id = $this->request->getPost('showing_id');
            $showing['seating'] = $this->request->getPost('seating');
            $showing['num_seats'] = $this->request->getPost('num_seats');

            $this->showing->update($showing_id,$showing);
            
            $payment['total'] = $this->request->getPost('total');
            $payment['cust_id'] = $this->request->getPost('cust_id');
            $this->payment->insert($payment);

            $where['total']=$payment['total'];
            $where['date']=date("Y-m-d");
            $payment_id = $this->payment->selectMax('payment_id')->where($where)->find();

            $tickets = json_decode($this->request->getPost('tickets'),true);

            for($i=0;$i<sizeof($tickets);$i++){
                $tickets[$i]['payment_id'] = $payment_id[0]['payment_id'];

                $this->tickets->insert($tickets[$i]);
            }

            if(!empty($this->request->getPost('snacks'))){
                $snacks = json_decode($this->request->getPost('snacks'),true);
                for($i=0;$i<sizeof($snacks);$i++){
                    $snacks[$i]['payment_id'] = $payment_id[0]['payment_id'];

                    $this->snackPurchase->insert($snacks[$i]);
                }
            }

            $response['success'] = true;
            $response['message'] = "Successfully Purchased Ticket!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function getPayments($id){
        try{
            $data = $this->payment->where('cust_id',$id)->orderBy('date','DESC')->findAll();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function getPaymentDetail($id){
        try{
            $data['payment'] = $this->payment->find($id);

            $tmp_tickets = $this->tickets->where('payment_id',$id)->find();
            for($i=0;$i<sizeof($tmp_tickets);$i++){
                $tmp_showing = $this->showing->find($tmp_tickets[$i]['showing_id']);

                $tmp_tickets[$i]['name'] = $tmp_showing['name'];
                $tmp_tickets[$i]['start_time'] = $tmp_showing['start_time'];
                $tmp_tickets[$i]['end_time'] = $tmp_showing['end_time'];
                $tmp_tickets[$i]['show_date'] = $tmp_showing['show_date'];
            }
            $data['tickets'] = $tmp_tickets;

            $data['snacks'] = $this->snackPurchase->where('payment_id',$id)->find();

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }

    public function getQuickBook(){
        try{
            $where['show_date >'] = date('Y-m-d');
            $where['enabled_by <'] = date('Y-m-d');
            $where['num_seats >'] = 0;

            $showings = $this->showing->where($where)->find();
            
            $tmp = $this->showing->select('movie_id')->where($where)->distinct()->find();
            $movies = array();

            for($i=0;$i<sizeof($tmp);$i++){
                $movies[] = $this->movie->select('movie_id, title')->find($tmp[$i]['movie_id']);
            }

            $tmp = $this->showing->select('exp_id')->where($where)->distinct()->find();
            $exps = array();

            for($i=0;$i<sizeof($tmp);$i++){
                $exps[] = $this->exp->select('exp_id, name')->find($tmp[$i]['exp_id']);
            }

            $dates = $this->showing->select('show_date')->where($where)->distinct()->find();

            $data['showings'] = $showings;
            $data['movies'] = $movies;
            $data['exps'] = $exps;
            $data['dates'] = $dates;

            $response['data'] = $data;
            $response['success'] = true;
            $response['message'] = "Successfully Retrieved!";

            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success'] = false;
            $response['message'] = $e->getMessage();

            return json_encode($response);
        }
    }
}

?>