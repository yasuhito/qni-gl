class BackendController < ApplicationController
  def show
    circuit_id = params[:id]
    qubit_count = params[:qubitCount].to_i

    Rails.logger.debug "circuit_id = #{circuit_id}"
    Rails.logger.debug "qubit_count = #{qubit_count}"
  end
end
