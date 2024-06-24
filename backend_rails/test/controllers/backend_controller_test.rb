require "test_helper"

class BackendControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get backend_show_url(format: :json)
    assert_response :success
  end
end
