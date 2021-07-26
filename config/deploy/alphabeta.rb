server "45.33.84.244", :app, :web, :db, :primary => true
set :deploy_to, "/web/alphabeta"
set :user, "alphabeta_user"

set :shared_children, fetch(:shared_children, []).push("uploads", "databases", "node_modules", "myenv")

after "deploy", "deploy:npm_install"
#after "deploy", "deploy:run_extra_command"
after "deploy", "deploy:restart_node"

namespace :deploy do
  task :npm_install, :roles => :web do
    run "cd /web/alphabeta/current/ && npm install && npm update"
  end
end

namespace :deploy do
  task :run_extra_command, :roles => :web do
    run "cd /web/alphabeta/current/ && ./node_modules/.bin/sequelize db:migrate --env production"
  end
end

namespace :deploy do
  task :restart_node, :roles => :web do
	run "cd /web/alphabeta/current && pm2 startOrRestart pm2-script/alphabeta.json"
  end
end

role :web, "45.33.84.244"
role :app, "45.33.84.244"
role :db, "45.33.84.244"
