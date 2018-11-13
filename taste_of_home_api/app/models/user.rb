class User < ApplicationRecord
  has_many :reviews
  has_many :favorites
  validates :name, presence: true, uniqueness: true
  # has_secure_password

end
