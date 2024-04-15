require 'cirq'

class BackendController < ApplicationController
  def show
    circuit_id = params[:id]
    qubit_count = params[:qubitCount].to_i
    step_index = params[:stepIndex].to_i
    targets = params[:targets].split(',').map(&:to_i) if params[:targets]
    steps = params[:steps] ? JSON.parse(params[:steps]) : []

    Rails.logger.debug "circuit_id = #{circuit_id}"
    Rails.logger.debug "qubit_count = #{qubit_count}"
    Rails.logger.debug "step_index = #{step_index}"
    Rails.logger.debug "targets = [#{targets.join(', ')}]"
    Rails.logger.debug "steps = #{steps}"

    @step_results = Cirq.new(circuit_id: circuit_id,
                             qubit_count: qubit_count,
                             step_index: step_index,
                             steps: steps,
                             targets: targets).run
  end
end
