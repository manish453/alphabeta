require "capistrano/ext/multistage"
set :repository, "git@github.com:manish453/alphabeta.git"
set :user, "root"
set :use_sudo, false
set :keep_releases, 5
set :deploy_via, :remote_cache
set :copy_exclude, [".git"]
set :normalize_asset_timestamps, false

logger.level = Logger::MAX_LEVEL

set :stages, ["alphabeta"]
set :default_stage, "alphabeta"
