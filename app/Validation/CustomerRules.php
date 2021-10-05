<?php

namespace App\Validation;

use App\Models\CustomerModel;
use Exception;

class CustomerRules
{
    public function validateCustomer(string $str, string $fields, array $data): bool
    {
        try {
            $model = new CustomerModel();
            $cust = $model->where("email",$data['email'])->first();
            return password_verify($data['password'], $cust['password']);
        } catch (Exception $e) {
            return false;
        }
    }
}